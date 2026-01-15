# Deliverer Service Dockerfile
FROM maven:3.9-eclipse-temurin-17-alpine AS build

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Install SQLite
RUN apk add --no-cache sqlite

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Copy database scripts
COPY database ./database

# Create database directory
RUN mkdir -p /app/data

# Initialize database
RUN chmod +x /app/database/create_db.sh && \
    cd /app/data && \
    /app/database/create_db.sh deliverers.db

# Expose port
EXPOSE 8003

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8003/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
