package com.example.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.*;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import jakarta.servlet.http.HttpServletRequest;
import java.net.URI;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@CrossOrigin(origins = "*")
public class ProxyController {

    @Value("${DOCUMENTS_SERVICE_URL:http://localhost:8081}")
    private String documentsServiceUrl;

    @Value("${COMMENTS_SERVICE_URL:http://localhost:8082}")
    private String commentsServiceUrl;

    @Value("${AUTH_SERVICE_URL:http://localhost:8083}")
    private String authServiceUrl;

    private final RestTemplate restTemplate;
    
    // Simple Rate Limiting: 100 requests per minute per IP
    private final Map<String, AtomicInteger> requestCounts = new ConcurrentHashMap<>();
    private final Map<String, Long> windowStartTimes = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS = 100;
    private static final long WINDOW_SIZE_MS = 60000;

    public ProxyController() {
        // Use HttpComponentsClientHttpRequestFactory to support PATCH method
        HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
        this.restTemplate = new RestTemplate(requestFactory);
    }

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> root() {
        Map<String, String> response = new HashMap<>();
        response.put("service", "DMS API Gateway");
        response.put("status", "running");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/api/documents/**", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH})
    public ResponseEntity<?> proxyDocuments(HttpServletRequest request, @RequestBody(required = false) String body) {
        return proxyRequest(request, body, documentsServiceUrl);
    }

    @RequestMapping(value = "/api/users/**", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH})
    public ResponseEntity<?> proxyUsers(HttpServletRequest request, @RequestBody(required = false) String body) {
        return proxyRequest(request, body, documentsServiceUrl);
    }

    @RequestMapping(value = "/api/categories/**", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH})
    public ResponseEntity<?> proxyCategories(HttpServletRequest request, @RequestBody(required = false) String body) {
        return proxyRequest(request, body, documentsServiceUrl);
    }

    @RequestMapping(value = "/api/departments/**", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH})
    public ResponseEntity<?> proxyDepartments(HttpServletRequest request, @RequestBody(required = false) String body) {
        return proxyRequest(request, body, documentsServiceUrl);
    }

    @RequestMapping(value = "/api/comments/**", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH})
    public ResponseEntity<?> proxyComments(HttpServletRequest request, @RequestBody(required = false) String body) {
        return proxyRequest(request, body, commentsServiceUrl);
    }

    @RequestMapping(value = "/auth/**", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH})
    public ResponseEntity<?> proxyAuth(HttpServletRequest request, @RequestBody(required = false) String body) {
        return proxyRequest(request, body, authServiceUrl);
    }

    private ResponseEntity<?> proxyRequest(HttpServletRequest request, String body, String targetUrl) {
        String clientIp = request.getRemoteAddr();
        long now = System.currentTimeMillis();
        
        windowStartTimes.putIfAbsent(clientIp, now);
        if (now - windowStartTimes.get(clientIp) > WINDOW_SIZE_MS) {
            windowStartTimes.put(clientIp, now);
            requestCounts.put(clientIp, new AtomicInteger(0));
        }
        
        requestCounts.putIfAbsent(clientIp, new AtomicInteger(0));
        if (requestCounts.get(clientIp).incrementAndGet() > MAX_REQUESTS) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Too Many Requests");
            errorResponse.put("message", "Rate limit exceeded. Try again later.");
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(errorResponse);
        }

        try {
            String path = request.getRequestURI();
            String queryString = request.getQueryString();
            String fullPath = queryString != null ? path + "?" + queryString : path;
            
            URI uri = URI.create(targetUrl + fullPath);
            
            HttpHeaders headers = new HttpHeaders();
            Enumeration<String> headerNames = request.getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();
                // Skip headers that should not be forwarded
                if (!headerName.equalsIgnoreCase("host") && 
                    !headerName.equalsIgnoreCase("content-length") &&
                    !headerName.equalsIgnoreCase("transfer-encoding") &&
                    !headerName.equalsIgnoreCase("connection")) {
                    headers.put(headerName, Collections.list(request.getHeaders(headerName)));
                }
            }
            
            HttpEntity<String> entity = new HttpEntity<>(body, headers);
            HttpMethod method = HttpMethod.valueOf(request.getMethod());
            
            System.out.println("Proxying " + method + " request to: " + uri);
            
            ResponseEntity<String> response = restTemplate.exchange(uri, method, entity, String.class);
            
            // Create clean response headers
            HttpHeaders responseHeaders = new HttpHeaders();
            response.getHeaders().forEach((key, value) -> {
                // Skip problematic headers
                if (!key.equalsIgnoreCase("transfer-encoding") && 
                    !key.equalsIgnoreCase("connection")) {
                    responseHeaders.put(key, value);
                }
            });
            
            // Ensure Content-Length is set to avoid chunked encoding
            String responseBody = response.getBody();
            if (responseBody != null && responseHeaders.getContentLength() < 0) {
                responseHeaders.setContentLength(responseBody.getBytes().length);
            }
            
            return ResponseEntity.status(response.getStatusCode())
                    .headers(responseHeaders)
                    .body(responseBody);
                    
        } catch (HttpClientErrorException e) {
            System.err.println("Client error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            return ResponseEntity.status(e.getStatusCode())
                    .body(e.getResponseBodyAsString());
        } catch (HttpServerErrorException e) {
            System.err.println("Server error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            return ResponseEntity.status(e.getStatusCode())
                    .body(e.getResponseBodyAsString());
        } catch (Exception e) {
            System.err.println("Proxy error: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Gateway proxy error");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }
}
