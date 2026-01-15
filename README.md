# Plateforme de Gestion des Livraisons

## Description
Application web basée sur une architecture de microservices pour gérer le cycle de vie complet des livraisons, de la création de commande jusqu'à la remise au client final.

## Architecture

### Microservices
1. **Order Service (Port 8001)** - Gestion des commandes
2. **Delivery Service (Port 8002)** - Gestion et suivi des livraisons
3. **Deliverer Service (Port 8003)** - Gestion des livreurs
4. **API Gateway (Port 8000)** - Point d'entrée unique
5. **Service Registry (Port 8761)** - Découverte de services
6. **Config Server (Port 8888)** - Configuration centralisée

### Technologies
- **Backend**: Java 17, Spring Boot 3.2, Spring Cloud
- **Framework**: Spring Web, Spring Data JPA, Spring Cloud Gateway, Netflix Eureka
- **Build Tool**: Maven 3.9
- **Base de données**: SQLite3 (base dédiée par service)
- **Conteneurisation**: Docker
- **Communication**: REST API + Message Broker (RabbitMQ)
- **Pattern**: Circuit Breaker (Resilience4j), Service Registry (Eureka), API Gateway, Config Server

## Structure du Projet

```
delivery-app/
├── order-service/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/deliveryapp/order/
│   │       └── resources/
│   │           └── application.yml
│   ├── database/
│   │   ├── schema.sql
│   │   ├── init.sql
│   │   └── create_db.sh
│   ├── Dockerfile
│   ├── pom.xml
│   └── .env.example
├── delivery-service/
│   ├── database/
│   │   ├── schema.sql
│   │   ├── init.sql
│   │   └── create_db.sh
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── deliverer-service/
│   ├── database/
│   │   ├── schema.sql
│   │   ├── init.sql
│   │   └── create_db.sh
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── api-gateway/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── service-registry/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
└── config-server/
    ├── Dockerfile
    ├── requirements.txt
    └── .env.example
```

## Bases de Données

### Order Service Database (orders.db)
**Tables:**
- `customers` - Informations clients
- `orders` - Commandes
- `order_items` - Articles de commande
- `order_status_history` - Historique des statuts

### Delivery Service Database (deliveries.db)
**Tables:**
- `deliveries` - Livraisons
- `delivery_tracking` - Suivi en temps réel
- `delivery_status_history` - Historique des statuts
- `delivery_issues` - Problèmes de livraison
- `delivery_notifications` - Notifications

### Deliverer Service Database (deliverers.db)
**Tables:**
- `deliverers` - Livreurs
- `deliverer_vehicles` - Véhicules
- `deliverer_documents` - Documents
- `deliverer_availability` - Disponibilités
- `deliverer_shifts` - Postes de travail
- `deliverer_locations` - Localisation GPS
- `deliverer_performance` - Performance
- `deliverer_ratings` - Évaluations

##Java 17+ (pour développement local)
- Maven 3.9on et Configuration

### Prérequis
- Docker et Docker Compose
- SQLite3
- Python 3.11+ (pour développement local)
- Git

### Initialisation des bases de données

#### Order Service
```bash
cd order-service/database
chmod +x create_db.sh
./create_db.sh
```

#### Delivery Service
```bash
cd delivery-service/database
chmod +x create_db.sh
./create_db.sh
```

#### Deliverer Service
```bash
cd deliverer-service/database
chmod +x create_db.sh
./create_db.sh
```

### Configuration des Services

1. Copier les fichiers `.env.example` vers `.env` pour chaque service:
```bash
cp order-service/.env.example order-service/.env
cp delivery-service/.env.example delivery-service/.env
cp deliverer-service/.env.example deliverer-service/.env
cp api-gateway/.env.example api-gateway/.env
cp service-registry/.env.example service-registry/.env
cp config-server/.env.example config-server/.env
```

2. Modifier les variables d'environnement selon vos besoins

### Construction des Images Docker
Utiliser le script fourni:
```bash
./build-all.sh
```

Ou construire individuellement:
```bash
# Order Service
docker build -t delivery-app/order-service:latest ./order-service

# Delivery Service
docker build -t delivery-app/delivery-service:latest ./delivery-service

# Deliverer Service
docker build -t delivery-app/deliverer-service:latest ./deliverer-service

# API Gateway
docker build -t delivery-app/api-gateway:latest ./api-gateway

# Service Registry
docker build -t delivery-app/service-registry:latest ./service-registry

# Config Server
docker build -t delivery-app/config-server:latest ./config-server
```

**Note**: La construction utilise Maven multi-stage build. La première fois peut prendre plus de temps pour télécharger les dépendances.ker build -t delivery-app/config-server:latest ./config-server
```

### Exécution des Services

```bash
# Service Registry (à démarrer en premier)
docker run -d -p 8761:8761 --name service-registry delivery-app/service-registry:latest

# Config Server
docker run -d -p 8888:8888 --name config-server delivery-app/config-server:latest

# Order Service
docker run -d -p 8001:8001 --name order-service delivery-app/order-service:latest

# Delivery Service
docker run -d -p 8002:8002 --name delivery-service delivery-app/delivery-service:latest

# Deliverer Service
docker run -d -p 8003:8003 --name deliverer-service delivery-app/deliverer-service:latest

# API Gateway
docker run -d -p 8000:8000 --name api-gateway delivery-app/api-gateway:latest
```

## Communication Inter-Services

### Communication Synchrone (REST API)
- Les microservices communiquent via des appels HTTP REST
- Circuit Breaker implémenté pour la gestion des erreurs
- Retry mechanism avec backoff exponentiel

### Communication Asynchrone (Message Broker)
- RabbitMQ pour la messagerie asynchrone
- Utilisé pour les notifications et événements

## Schéma des Statuts

### Statuts de Commande
1. `PENDING` - En attente
2. `CONFIRMED` - Confirmée
3. `PROCESSING` - En préparation
4. `READY_FOR_DELIVERY` - Prête pour livraison
5. `COMPLETED` - Complétée
6. `CANCELLED` - Annulée

### Statuts de Livraison
1. `PENDING_ASSIGNMENT` - En attente d'assignation
2. `ASSIGNED` - Assignée
3. `PICKED_UP` - Récupérée
4. `IN_TRANSIT` - En transit
5. `ARRIVED` - Arrivée
6. `DELIVERED` - Livrée
7. `FAILED` - Échouée
8. `CANCELLED` - Annulée

### Statuts de Livreur
1. `ACTIVE` - Actif
2. `INACTIVE` - Inactif
3. `ON_BREAK` - En pause
4. `OFF_DUTY` - Hors service
5. `SUSPENDED` - Suspendu

## API Endpoints

### Via API Gateway (http://localhost:8000)

#### Orders
- `GET /api/orders` - Liste des commandes
- `GET /api/orders/{id}` - Détails d'une commande
- `POST /api/orders` - Créer une commande
- `PUT /api/orders/{id}` - Mettre à jour une commande
- `DELETE /api/orders/{id}` - Supprimer une commande

#### Deliveries
- `GET /api/deliveries` - Liste des livraisons
- `GET /api/deliveries/{id}` - Détails d'une livraison
- `POST /api/deliveries` - Créer une livraison
- `PUT /api/deliveries/{id}` - Mettre à jour une livraison
- `GET /api/deliveries/{id}/track` - Suivi en temps réel

#### Deliverers
- `GET /api/deliverers` - ListSpring Validation (JSR-303)
- CORS configuré via Spring Cloud Gateway
- Rate limiting sur l'API Gateway (configurable)
- Health checks pour tous les services via Spring Actuator
- Circuit Breaker avec Resilience4jà jour un livreur
- `GET /api/deliverers/{id}/location` - Position GPS

## Sécurité

- Validation des données avec Pydantic
- CORS configuré
- Rate limiting sur l'API Gateway
- Health checks pour tous les services

## Monitoring et Logs
avec Logback (Spring Boot default)
- Health checks endpoints: `/actuator/health`
- Métriques disponibles via: `/actuator/metrics`
- Eureka Dashboard: `http://localhost:8761`
- Gateway routes: `/actuator/gateway/route
- Métriques disponibles via les endpoints: `/metrics`

## Tests

### Tester les bases de données
```bash
# Order Service
sqlite3 order-service/data/orders.db "SELECT * FROM orders;"

# Delivery Service
sqlite3 delivery-service/data/deliveries.db "SELECT * FROM deliveries;"

# Deliverer Service
sqlite3 deliverer-service/data/deliverers.db "SELECT * FROM deliverers;"
```

## Développement

### Exigences Techniques Implémentées
- ✅ Bases de données séparées par microservice
- ✅ Communication synchrone (REST API)
- ✅ Gestion des erreurs (Circuit Breaker)
- ✅ Service Registry
- ✅ API Gateway
- ✅ Config Server centralisé
- ✅ Conteneurisation Docker

## Améliorations Futures (Optionnelles)
- Docker Compose pour orchestration
- Keycloak pour SSO
- Interface web frontend
- Monitoring avec Prometheus/Grafana
- CI/CD pipeline

## Auteurs
Projet Mini - Architecture Microservices

## Licence
Projet Académique - 2026
