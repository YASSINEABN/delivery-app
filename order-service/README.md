# Order Service

Service de gestion des commandes pour la plateforme de livraison (Spring Boot).

## Description
Gère la création, modification et suivi des commandes clients avec Spring Data JPA.

## Technologies
- Java 17
- Spring Boot 3.2
- Spring Data JPA
- Spring Cloud (Eureka, Config, Feign, Circuit Breaker)
- SQLite Database
- Maven

## Base de Données

### Tables
- **customers**: Informations des clients
- **orders**: Commandes
- **order_items**: Articles des commandes
- **order_status_history**: Historique des changements de statut

## Installation

### Initialisation de la base de données
```bash
cd database
chmod +x create_db.sh
./create_db.sh
```

### Build avec Maven
```bash
mvn clean install
```

## Docker

### Build
```bash
docker build -t delivery-app/order-service:latest .
```

### Run
```bash
docker run -d -p 8001:8001 --name order-service delivery-app/order-service:latest
```

## Développement Local

```bash
# Avec Maven
mvn spring-boot:run

# Avec JAR
mvn clean package
java -jar target/order-service-1.0.0.jar
```

## API Endpoints

- `GET /actuator/health` - Health check
- `GET /api/orders` - Liste des commandes
- `GET /api/orders/{id}` - Détails d'une commande
- `POST /api/orders` - Créer une commande
- `PUT /api/orders/{id}` - Mettre à jour
- `DELETE /api/orders/{id}` - Supprimer

## Configuration

Configuration Spring Boot dans `src/main/resources/application.yml`:
- Port: 8001
- Database: SQLite (/app/data/orders.db)
- Eureka: Enregistrement automatique
- Circuit Breaker: Resilience4j

## Statuts de Commande
- PENDING
- CONFIRMED
- PROCESSING
- READY_FOR_DELIVERY
- COMPLETED
- CANCELLED
