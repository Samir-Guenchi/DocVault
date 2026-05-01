# Translation Consumer

Kafka consumer that reads translated document events and persists them back to PostgreSQL.

## Architecture

```
dms.documents.translated (Kafka) → Consumer → PostgreSQL (documents table)
```

## Tech Stack

- **Language:** Python
- **Database:** PostgreSQL (via psycopg2)
- **Messaging:** Apache Kafka (consumer)

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `KAFKA_BOOTSTRAP_SERVERS` | `localhost:9093` | Kafka broker |
| `KAFKA_GROUP_ID` | `translation-consumer` | Consumer group |
| `KAFKA_INPUT_TOPIC` | `dms.documents.translated` | Input topic |
| `POSTGRES_HOST` | `localhost` | PostgreSQL host |
| `POSTGRES_PORT` | `5432` | PostgreSQL port |
| `POSTGRES_DB` | `dms` | Database name |
| `AUTO_OFFSET_RESET` | `earliest` | Kafka offset policy |
