/**
 * K6 Load Test for Comments Service (Cassandra Backend)
 * Lab 8 Assignment: Performance Comparison
 * 
 * Run: k6 run --env BASE_URL=http://localhost:8083 comments-cassandra-test.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const commentCreationTime = new Trend('comment_creation_time');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 20 },   // Warm up: ramp to 20 users
    { duration: '1m', target: 100 },   // Load test: ramp to 100 users
    { duration: '30s', target: 0 },    // Cool down: ramp down to 0
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'],  // 95% of requests under 500ms
    'http_req_failed': ['rate<0.01'],    // Error rate under 1%
    'errors': ['rate<0.01'],             // Custom error rate under 1%
    'comment_creation_time': ['p(95)<500'], // 95% creation time under 500ms
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8083';
const DOC_ID = '550e8400-e29b-41d4-a716-446655440000';

export default function () {
  // Create comment
  const payload = JSON.stringify({
    docId: DOC_ID,
    content: `Load test comment from VU ${__VU} at ${Date.now()}`,
    author: `TestUser${__VU}`,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const startTime = Date.now();
  const createResponse = http.post(`${BASE_URL}/api/comments`, payload, params);
  const creationTime = Date.now() - startTime;

  // Record metrics
  commentCreationTime.add(creationTime);
  
  const createSuccess = check(createResponse, {
    'create status is 201': (r) => r.status === 201,
    'create response time < 500ms': (r) => r.timings.duration < 500,
    'create response has commentId': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.commentId !== undefined;
      } catch (e) {
        return false;
      }
    },
  });

  if (!createSuccess) {
    errorRate.add(1);
    console.error(`Create failed: ${createResponse.status} - ${createResponse.body}`);
  } else {
    errorRate.add(0);
  }

  // Read comments (10% of the time)
  if (Math.random() < 0.1) {
    const readResponse = http.get(`${BASE_URL}/api/comments/${DOC_ID}`);
    
    check(readResponse, {
      'read status is 200': (r) => r.status === 200,
      'read response time < 200ms': (r) => r.timings.duration < 200,
    });
  }

  sleep(1); // Think time between requests
}

export function handleSummary(data) {
  return {
    'cassandra-results.json': JSON.stringify(data, null, 2),
    'cassandra-results.txt': textSummary(data, { indent: ' ', enableColors: false }),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function textSummary(data, options) {
  const indent = options.indent || '';
  const enableColors = options.enableColors !== false;
  
  let summary = '\n';
  summary += `${indent}========================================\n`;
  summary += `${indent}  Cassandra Backend - Load Test Results\n`;
  summary += `${indent}========================================\n\n`;
  
  // Test duration
  const duration = data.state.testRunDurationMs / 1000;
  summary += `${indent}Test Duration: ${duration.toFixed(2)}s\n\n`;
  
  // HTTP metrics
  const httpReqs = data.metrics.http_reqs.values.count;
  const httpReqDuration = data.metrics.http_req_duration.values;
  const httpReqFailed = data.metrics.http_req_failed.values.rate * 100;
  
  summary += `${indent}HTTP Requests:\n`;
  summary += `${indent}  Total: ${httpReqs}\n`;
  summary += `${indent}  Throughput: ${(httpReqs / duration).toFixed(2)} req/s\n`;
  summary += `${indent}  Failed: ${httpReqFailed.toFixed(2)}%\n\n`;
  
  summary += `${indent}Response Times:\n`;
  summary += `${indent}  Min: ${httpReqDuration.min.toFixed(2)}ms\n`;
  summary += `${indent}  Avg: ${httpReqDuration.avg.toFixed(2)}ms\n`;
  summary += `${indent}  Med: ${httpReqDuration.med.toFixed(2)}ms\n`;
  summary += `${indent}  P90: ${httpReqDuration['p(90)'].toFixed(2)}ms\n`;
  summary += `${indent}  P95: ${httpReqDuration['p(95)'].toFixed(2)}ms\n`;
  summary += `${indent}  P99: ${httpReqDuration['p(99)'].toFixed(2)}ms\n`;
  summary += `${indent}  Max: ${httpReqDuration.max.toFixed(2)}ms\n\n`;
  
  // Custom metrics
  if (data.metrics.comment_creation_time) {
    const creationTime = data.metrics.comment_creation_time.values;
    summary += `${indent}Comment Creation Time:\n`;
    summary += `${indent}  Avg: ${creationTime.avg.toFixed(2)}ms\n`;
    summary += `${indent}  P95: ${creationTime['p(95)'].toFixed(2)}ms\n\n`;
  }
  
  // Virtual users
  const vus = data.metrics.vus.values.max;
  summary += `${indent}Virtual Users: ${vus}\n\n`;
  
  // Thresholds
  summary += `${indent}Thresholds:\n`;
  for (const [name, threshold] of Object.entries(data.thresholds || {})) {
    const passed = threshold.ok ? '✓ PASS' : '✗ FAIL';
    summary += `${indent}  ${passed} ${name}\n`;
  }
  
  summary += `\n${indent}========================================\n`;
  
  return summary;
}
