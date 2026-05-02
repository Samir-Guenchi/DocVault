# Translator Service

Kafka consumer that reads document upload events, calls Google Gemini AI for translation, and publishes results to a second Kafka topic.

## Architecture

```
dms.documents.uploaded (Kafka) → Translator → Gemini AI → dms.documents.translated (Kafka)
```

## Tech Stack

- **Language:** Python
- **AI:** Google Gemini API
- **Messaging:** Apache Kafka (consumer + producer)

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `KAFKA_BOOTSTRAP_SERVERS` | `localhost:9093` | Kafka broker |
| `KAFKA_GROUP_ID` | `translator-service` | Consumer group |
| `KAFKA_INPUT_TOPIC` | `dms.documents.uploaded` | Input topic |
| `KAFKA_OUTPUT_TOPIC` | `dms.documents.translated` | Output topic |
| `GEMINI_API_KEY` | — | Google Gemini API key (**required**) |
| `AUTO_OFFSET_RESET` | `latest` | Kafka offset reset policy |

### Setting up Gemini API Key

The service requires a valid Google Gemini API key. To configure:

1. **Docker Compose:** Set in `docker-compose.full.yml`
   ```yaml
   translator-service:
     environment:
       GEMINI_API_KEY: your-api-key-here
   ```

2. **Local Development:** Export as environment variable
   ```bash
   export GEMINI_API_KEY=your-api-key-here
   python translator.py
   ```

**Current Configuration:** The API key is already configured in the docker-compose file.

## Design Decisions

- **No direct API calls** to other services — Kafka-only communication
- **Manual offset commit** after successful Gemini call + publish
- **API key via environment** — never baked into the image
- **Retry on failure** — exponential backoff on Gemini errors
