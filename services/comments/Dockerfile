# Stage 1: Build with Maven
FROM eclipse-temurin:21-jdk-jammy AS builder
WORKDIR /build
COPY .mvn/ .mvn/
COPY mvnw mvnw.cmd pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B 2>/dev/null || true
COPY src/ src/
RUN ./mvnw package -DskipTests -B 2>/dev/null || (chmod +x mvnw && ./mvnw package -DskipTests -B)

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=builder /build/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java","-jar","app.jar"]
