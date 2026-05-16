package com.example.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AuditService {
    private static final Logger logger = LoggerFactory.getLogger("AUDIT_LOGGER");

    public void logEvent(String action, String user, String resourceType, String resourceId, String details) {
        String auditMessage = String.format(
            "{\"timestamp\":\"%s\", \"action\":\"%s\", \"user\":\"%s\", \"resourceType\":\"%s\", \"resourceId\":\"%s\", \"details\":\"%s\"}",
            Instant.now().toString(), action, user, resourceType, resourceId, details
        );
        logger.info(auditMessage);
    }
}
