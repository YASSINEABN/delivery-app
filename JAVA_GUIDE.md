# Guide de Configuration Java pour le Projet

## Architecture Technique

### Stack Technologique
- **Java**: 17 (LTS)
- **Spring Boot**: 3.2.0
- **Spring Cloud**: 2023.0.0
- **Build Tool**: Maven 3.9
- **Database**: SQLite3 avec JDBC
- **ORM**: Spring Data JPA + Hibernate

### Dépendances Principales

#### Tous les Services
- `spring-boot-starter-web` - REST APIs
- `spring-boot-starter-data-jpa` - Accès base de données
- `spring-boot-starter-actuator` - Health checks & métriques
- `spring-cloud-starter-netflix-eureka-client` - Service discovery
- `spring-cloud-starter-config` - Configuration centralisée
- `spring-cloud-starter-circuitbreaker-resilience4j` - Circuit breaker
- `sqlite-jdbc` - Driver SQLite
- `hibernate-community-dialects` - Support SQLite pour Hibernate

#### Services Spécifiques

**Delivery Service** (en plus):
- `spring-boot-starter-websocket` - WebSocket pour suivi temps réel
- `spring-boot-starter-amqp` - RabbitMQ pour messagerie asynchrone

**API Gateway** (différent):
- `spring-cloud-starter-gateway` - Gateway réactif
- `spring-cloud-starter-circuitbreaker-reactor-resilience4j` - Circuit breaker réactif

**Service Registry**:
- `spring-cloud-starter-netflix-eureka-server` - Serveur Eureka

**Config Server**:
- `spring-cloud-config-server` - Serveur de configuration

## Configuration Spring Boot

### Structure des Fichiers

```
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── deliveryapp/
│   │           └── [service]/
│   │               ├── [Service]Application.java
│   │               ├── controller/
│   │               ├── service/
│   │               ├── repository/
│   │               ├── model/
│   │               ├── dto/
│   │               ├── config/
│   │               └── client/
│   └── resources/
│       ├── application.yml
│       └── application-[profile].yml
└── test/
    └── java/
        └── com/
            └── deliveryapp/
                └── [service]/
```

### Configuration SQLite avec Spring Boot

Spring Boot ne supporte pas SQLite nativement. Configuration nécessaire:

#### 1. Dépendances (déjà dans pom.xml)
```xml
<dependency>
    <groupId>org.xerial</groupId>
    <artifactId>sqlite-jdbc</artifactId>
    <version>3.44.1.0</version>
</dependency>
<dependency>
    <groupId>org.hibernate.orm</groupId>
    <artifactId>hibernate-community-dialects</artifactId>
</dependency>
```

#### 2. Configuration application.yml
```yaml
spring:
  datasource:
    url: jdbc:sqlite:/app/data/orders.db
    driver-class-name: org.sqlite.JDBC
  jpa:
    database-platform: org.hibernate.community.dialect.SQLiteDialect
    hibernate:
      ddl-auto: none  # Important: ne pas recréer le schéma
```

#### 3. Classe de Configuration Personnalisée

Créer `DatabaseConfig.java` dans chaque service:

```java
package com.deliveryapp.order.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.deliveryapp.order.repository")
public class DatabaseConfig {
    // Configuration personnalisée si nécessaire
}
```

## Entités JPA

### Exemple: Order Entity

```java
package com.deliveryapp.order.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "order_number", unique = true, nullable = false)
    private String orderNumber;
    
    @Column(name = "customer_id", nullable = false)
    private Long customerId;
    
    @Column(nullable = false)
    private String status;
    
    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;
    
    @Column(name = "delivery_address", nullable = false)
    private String deliveryAddress;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

## Repositories Spring Data

```java
package com.deliveryapp.order.repository;

import com.deliveryapp.order.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    Optional<Order> findByOrderNumber(String orderNumber);
    
    List<Order> findByStatus(String status);
    
    List<Order> findByCustomerId(Long customerId);
}
```

## REST Controllers

```java
package com.deliveryapp.order.controller;

import com.deliveryapp.order.model.Order;
import com.deliveryapp.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderService orderService;
    
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return orderService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        return ResponseEntity.ok(orderService.save(order));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(
            @PathVariable Long id, 
            @RequestBody Order order) {
        return ResponseEntity.ok(orderService.update(id, order));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

## Communication Inter-Services avec Feign

### Configuration

```java
package com.deliveryapp.order.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "delivery-service")
public interface DeliveryClient {
    
    @PostMapping("/api/deliveries")
    DeliveryDTO createDelivery(@RequestBody DeliveryDTO delivery);
    
    @GetMapping("/api/deliveries/order/{orderId}")
    DeliveryDTO getDeliveryByOrderId(@PathVariable Long orderId);
}
```

### Utilisation dans le Service

```java
@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final DeliveryClient deliveryClient;
    
    @CircuitBreaker(name = "delivery-service", fallbackMethod = "createOrderWithoutDelivery")
    public Order createOrderWithDelivery(Order order) {
        Order savedOrder = orderRepository.save(order);
        
        // Appel au service de livraison
        DeliveryDTO delivery = new DeliveryDTO();
        delivery.setOrderId(savedOrder.getId());
        deliveryClient.createDelivery(delivery);
        
        return savedOrder;
    }
    
    // Méthode fallback en cas d'échec
    public Order createOrderWithoutDelivery(Order order, Exception ex) {
        log.warn("Delivery service unavailable, creating order only", ex);
        return orderRepository.save(order);
    }
}
```

## Circuit Breaker Configuration

```yaml
resilience4j:
  circuitbreaker:
    instances:
      delivery-service:
        sliding-window-size: 10
        failure-rate-threshold: 50
        wait-duration-in-open-state: 60s
        permitted-number-of-calls-in-half-open-state: 3
```

## Build et Déploiement

### Build Local

```bash
# Clean et build
mvn clean install

# Skip tests
mvn clean install -DskipTests

# Build uniquement
mvn clean package
```

### Exécution

```bash
# Avec Maven
mvn spring-boot:run

# Avec profil spécifique
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Avec JAR
java -jar target/order-service-1.0.0.jar

# Avec profil
java -jar -Dspring.profiles.active=prod target/order-service-1.0.0.jar
```

### Multi-Stage Docker Build

Les Dockerfiles utilisent un build en deux étapes:

1. **Stage Build**: Compilation avec Maven
2. **Stage Runtime**: Exécution avec JRE Alpine

Avantages:
- Image finale légère (~200-300 MB vs ~700+ MB)
- Pas d'outils de build dans l'image de production
- Meilleure sécurité

## Profiles Spring Boot

Créer des fichiers de configuration par environnement:

- `application.yml` - Configuration par défaut
- `application-dev.yml` - Développement
- `application-prod.yml` - Production
- `application-test.yml` - Tests

Activation:
```bash
# Variable d'environnement
export SPRING_PROFILES_ACTIVE=prod

# Argument JVM
java -jar -Dspring.profiles.active=prod app.jar

# Dans application.yml
spring:
  profiles:
    active: prod
```

## Tests

### Structure

```
src/test/java/
└── com/deliveryapp/order/
    ├── controller/
    │   └── OrderControllerTest.java
    ├── service/
    │   └── OrderServiceTest.java
    └── repository/
        └── OrderRepositoryTest.java
```

### Exemple de Test

```java
@SpringBootTest
@AutoConfigureMockMvc
class OrderControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private OrderService orderService;
    
    @Test
    void shouldGetAllOrders() throws Exception {
        mockMvc.perform(get("/api/orders"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}
```

## Logs

### Configuration Logback

Créer `src/main/resources/logback-spring.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <include resource="org/springframework/boot/logging/logback/defaults.xml"/>
    
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} - %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    
    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
    </root>
    
    <logger name="com.deliveryapp" level="DEBUG"/>
</configuration>
```

## Problèmes Courants

### 1. SQLite Lock Database
**Solution**: Configurer le timeout de connexion
```yaml
spring:
  datasource:
    url: jdbc:sqlite:/app/data/orders.db?busy_timeout=30000
```

### 2. Hibernate DDL Auto
**Important**: Toujours utiliser `ddl-auto: none` avec SQLite car les schémas sont créés par les scripts SQL.

### 3. Port Déjà Utilisé
```bash
# Trouver le processus
lsof -i :8001

# Tuer le processus
kill -9 <PID>
```

### 4. Dépendances Maven Corrompues
```bash
# Nettoyer le cache Maven
mvn dependency:purge-local-repository
```

## Commandes Utiles

```bash
# Compiler sans tests
mvn clean install -DskipTests

# Voir l'arbre des dépendances
mvn dependency:tree

# Vérifier les mises à jour
mvn versions:display-dependency-updates

# Analyser le projet
mvn clean compile

# Package avec profil
mvn clean package -P production

# Exécuter avec debug
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

## Ressources

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Cloud Documentation](https://spring.io/projects/spring-cloud)
- [Spring Data JPA Documentation](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [Resilience4j Documentation](https://resilience4j.readme.io/)
- [SQLite JDBC Documentation](https://github.com/xerial/sqlite-jdbc)
