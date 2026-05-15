# Build stage
FROM eclipse-temurin:21-jdk-jammy AS builder
WORKDIR /build

# Copy Maven wrapper and pom.xml
COPY .mvn/ .mvn/
COPY mvnw mvnw.cmd pom.xml ./

# Download dependencies
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B 2>/dev/null || true

# Copy source code
COPY src/ src/

# Build the application
RUN ./mvnw package -DskipTests -B 2>/dev/null || (chmod +x mvnw && ./mvnw package -DskipTests -B)

# Runtime stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy the built jar from builder stage
COPY --from=builder /build/target/*.jar app.jar

# Expose port
EXPOSE 8083

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
