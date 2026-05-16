# Enterprise Document Management System - Architecture

This diagram illustrates the comprehensive microservices architecture of the Enterprise DMS, highlighting synchronous API flows, asynchronous message-driven processes, and data persistence layers.

```mermaid
graph TB
    subgraph Client Layer
        UI[React/Vite Frontend UI]
        API_GW[API Gateway :8080<br/>Rate Limiting, Reverse Proxy]
    end

    subgraph Core Microservices Layer
        AUTH[Auth Service :8083<br/>JWT Authentication]
        DOCS[Documents Service :8081<br/>Uploads, ACL, Versioning]
        CATS[Categories Service :8082<br/>Taxonomy]
        COMS[Comments Service :8082<br/>Document Discussion]
    end

    subgraph AI & Asynchronous Processing Layer
        KAFKA[Kafka Broker<br/>Message Driven Arch]
        TRANS_CONS[AI Translation Consumer<br/>Python]
        TRANS_API[External AI API<br/>DeepSeek/Google]
        VIRUS[Async Virus Scanner<br/>Mocked]
    end

    subgraph Data & Storage Layer
        PG_DOCS[(PostgreSQL<br/>Documents & Users)]
        CASS[(Cassandra<br/>Comments & Audit Logs)]
        MINIO[(MinIO S3<br/>Object Storage)]
        REDIS[(Redis<br/>Hot Read Cache)]
    end

    subgraph Observability
        PROM[Prometheus<br/>Metrics Scraper]
        GRAF[Grafana<br/>Dashboards]
    end

    %% Client Interactions
    UI -->|HTTP Requests| API_GW
    API_GW -->|Proxy /auth| AUTH
    API_GW -->|Proxy /api/documents| DOCS
    API_GW -->|Proxy /api/categories| CATS
    API_GW -->|Proxy /api/comments| COMS

    %% Synchronous Internal Service Calls
    COMS -.->|Verify Access via JWT| DOCS

    %% Data Persistence
    AUTH -->|R/W| PG_DOCS
    DOCS -->|R/W| PG_DOCS
    CATS -->|R/W| PG_DOCS
    COMS -->|R/W| CASS
    DOCS -->|Cache Hit/Miss| REDIS
    DOCS -->|Direct Upload| MINIO

    %% Asynchronous Flow
    DOCS -->|Publish Upload Event| KAFKA
    KAFKA -->|Consume Event| TRANS_CONS
    TRANS_CONS -->|Request Translation| TRANS_API
    TRANS_API -->|Translation Result| TRANS_CONS
    TRANS_CONS -->|Persist Translations| PG_DOCS
    
    KAFKA -->|Consume Event| VIRUS

    %% Observability Flow
    AUTH -.->|Expose Metrics| PROM
    DOCS -.->|Expose Metrics| PROM
    CATS -.->|Expose Metrics| PROM
    COMS -.->|Expose Metrics| PROM
    GRAF -.->|Query| PROM

    classDef default fill:#f9f9f9,stroke:#333,stroke-width:1px;
    classDef client fill:#dbeafe,stroke:#3b82f6,stroke-width:2px;
    classDef service fill:#dcfce7,stroke:#22c55e,stroke-width:2px;
    classDef async fill:#fef08a,stroke:#eab308,stroke-width:2px;
    classDef data fill:#f3e8ff,stroke:#a855f7,stroke-width:2px;
    classDef obs fill:#fee2e2,stroke:#ef4444,stroke-width:2px;

    class UI,API_GW client;
    class AUTH,DOCS,CATS,COMS service;
    class KAFKA,TRANS_CONS,TRANS_API,VIRUS async;
    class PG_DOCS,CASS,MINIO,REDIS data;
    class PROM,GRAF obs;
```

## Key Architectural Patterns
1. **API Gateway Pattern:** All external client traffic enters through a single entry point (Port 8080).
2. **Microservices Architecture:** Independently deployable services with isolated domains (Auth, Documents, Comments).
3. **Database per Service:** Documents and Auth use PostgreSQL, while high-throughput Comments use Cassandra.
4. **Message-Driven Architecture:** The backend uses Kafka for event sourcing to decouple document uploads from AI translation.
5. **Cache-Aside Pattern:** Redis caches hot read paths (`@Cacheable`) and is invalidated on writes (`@CacheEvict`).
