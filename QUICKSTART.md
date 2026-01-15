# Guide de Démarrage Rapide

## Configuration Initiale

### Étape 1: Initialiser les Variables d'Environnement

```bash
# Pour chaque service, copier .env.example vers .env
cp order-service/.env.example order-service/.env
cp delivery-service/.env.example delivery-service/.env
cp deliverer-service/.env.example deliverer-service/.env
cp api-gateway/.env.example api-gateway/.env
cp service-registry/.env.example service-registry/.env
cp config-server/.env.example config-server/.env
```

### Étape 2: Initialiser les Bases de Données

```bash
# Utiliser le script d'initialisation global
./init-databases.sh
```

OU initialiser chaque base individuellement:

```bash
# Order Service
cd order-service/database
./create_db.sh
cd ../..

# Delivery Service
cd delivery-service/database
./create_db.sh
cd ../..

# Deliverer Service
cd deliverer-service/database
./create_db.sh
cd ../..
```

### Étape 3: Construire les Images Docker

Utiliser le script de construction automatique:

```bash
./build-all.sh
```

OU construire chaque image individuellement:

```bash
docker build -t delivery-app/service-registry:latest ./service-registry
docker build -t delivery-app/config-server:latest ./config-server
docker build -t delivery-app/order-service:latest ./order-service
docker build -t delivery-app/delivery-service:latest ./delivery-service
docker build -t delivery-app/deliverer-service:latest ./deliverer-service
docker build -t delivery-app/api-gateway:latest ./api-gateway
```

**Note**: La première construction peut prendre 10-15 minutes car Maven doit télécharger toutes les dépendances.

### Étape 4: Démarrer les Services

**Important**: Démarrer dans l'ordre suivant pour assurer les dépendances:

```bash
# 1. Service Registry (doit démarrer en premier)
docker run -d -p 8761:8761 --name service-registry --network delivery-network delivery-app/service-registry:latest

# 2. Config Server
docker run -d -p 8888:8888 --name config-server --network delivery-network delivery-app/config-server:latest

# Attendre 10-15 secondes pour que les services d'infrastructure soient prêts

# 3. Services métier (peuvent démarrer en parallèle)
docker run -d -p 8001:8001 --name order-service --network delivery-network delivery-app/order-service:latest

docker run -d -p 8002:8002 --name delivery-service --network delivery-network delivery-app/delivery-service:latest

docker run -d -p 8003:8003 --name deliverer-service --network delivery-network delivery-app/deliverer-service:latest

# 4. API Gateway (doit démarrer en dernier)
docker run -d -p 8000:8000 --name api-gateway --network delivery-network delivery-app/api-gateway:latest
```

### Étape 5: Créer le Réseau Docker (si nécessaire)

```bash
docker network create delivery-network
```

## Vérification

### Vérifier que tous les conteneurs sont en cours d'exécution

```bash
docker ps
```

Vous devriez voir 6 conteneurs en cours d'exécution.

### Tester les Health Checks

```bash
# Service Registry
curl http://localhost:8761/actuator/health

# Config Server
curl http://localhost:8888/actuator/health

# Order Service
curl http://localhost:8001/actuator/health

# Delivery Service
curl http://localhost:8002/actuator/health

# Deliverer Service
curl http://localhost:8003/actuator/health

# API Gateway
curl http://localhost:8000/actuator/health
```

### Accéder au Dashboard Eureka

Ouvrez votre navigateur et accédez à:
```
http://localhost:8761
```

Vous devriez voir tous les services enregistrés.

### Tester les API via le Gateway

```bash
# Lister les commandes
curl http://localhost:8000/api/orders

# Lister les livraisons
curl http://localhost:8000/api/deliveries

# Lister les livreurs
curl http://localhost:8000/api/deliverers
```

## Arrêter les Services

```bash
docker stop api-gateway delivery-service deliverer-service order-service config-server service-registry
docker rm api-gateway delivery-service deliverer-service order-service config-server service-registry
```

## Consulter les Logs

```bash
# Logs d'un service spécifique
docker logs order-service

# Suivre les logs en temps réel
docker logs -f delivery-service

# Logs de tous les services
docker logs service-registry
docker logs config-server
docker logs order-service
docker logs delivery-service
docker logs deliverer-service
docker logs api-gateway
```

## Accès aux Bases de Données

### Depuis l'hôte (si les bases sont dans des volumes)

```bash
# Order Service
sqlite3 order-service/database/orders.db

# Delivery Service
sqlite3 delivery-service/database/deliveries.db

# Deliverer Service
sqlite3 deliverer-service/database/deliverers.db
```

### Depuis le conteneur

```bash
# Accéder au conteneur
docker exec -it order-service /bin/bash

# Dans le conteneur
sqlite3 /app/data/orders.db
```

## Requêtes SQL Utiles

### Consulter les données de test

```sql
-- Orders
SELECT * FROM orders;
SELECT * FROM customers;
SELECT * FROM order_items;

-- Deliveries
SELECT * FROM deliveries;
SELECT * FROM delivery_tracking;
SELECT * FROM delivery_status_history;

-- Deliverers
SELECT * FROM deliverers;
SELECT * FROM deliverer_vehicles;
SELECT * FROM deliverer_performance;
```

## Dépannage

### Les conteneurs ne démarrent pas

1. Vérifier les logs: `docker logs <container_name>`
2. Vérifier que les ports ne sont pas déjà utilisés: `netstat -tulpn | grep <port>`
3. Vérifier que les images sont bien construites: `docker images | grep delivery-app`

### Erreurs de connexion entre services

1. Vérifier que tous les conteneurs sont sur le même réseau Docker
2. Vérifier les variables d'environnement dans les fichiers `.env`
3. Vérifier que le Service Registry est accessible

### Base de données corrompue

```bash
# Réinitialiser une base de données
cd <service>/database
rm *.db
./create_db.sh
```

### Réinitialisation complète

```bash
# Arrêter et supprimer tous les conteneurs
docker stop $(docker ps -aq --filter "name=delivery-app")
docker rm $(docker ps -aq --filter "name=delivery-app")

# Supprimer les images
docker rmi $(docker images -q "delivery-app/*")

# Supprimer les bases de données
rm order-service/database/*.db
rm delivery-service/database/*.db
rm deliverer-service/database/*.db

# Recommencer depuis l'étape 1
```

## Développement Local (sans Docker)

### Installation

```bash
# Vérifier Java
java -version  # Doit être 17+

# Vérifier Maven
mvn -version  # Doit être 3.9+
```

### Build

```bash
# Pour chaque service
cd <service>
mvn clean install
```

### Démarrage

Méthode 1: Avec Maven
```bash
# Dans chaque terminal (un par service)
cd <service>
mvn spring-boot:run
```

Méthode 2: Avec le JAR
```bash
cd <service>
mvn clean package
java -jar target/<service>-1.0.0.jar
```

## URLs des Services

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| API Gateway | 8000 | http://localhost:8000 | Point d'entrée principal |
| Order Service | 8001 | http://localhost:8001 | Service des commandes |
| Delivery Service | 8002 | http://localhost:8002 | Service des livraisons |
| Deliverer Service | 8003 | http://localhost:8003 | Service des livreurs |
| Service Registry | 8761 | http://localhost:8761 | Registre de services |
| Config Server | 8888 | http://localhost:8888 | Serveur de configuration |

## Prochaines Étapes (SQLite)
2. ✅ Maven configuré avec Spring Boot et Spring Cloud
3. ✅ Docker configuré pour tous les services
4. ✅ Structure Java Spring Boot mise en place
5. ⏭️ Implémenter les entités JPA pour chaque service
6. ⏭️ Implémenter les repositories Spring Data
7. ⏭️ Implémenter les REST controllers
8. ⏭️ Implémenter les clients Feign pour communication inter-services
9. ⏭️ Configurer RabbitMQ pour messagerie asynchrone
8. ⏭️ Implémenter le Config Server
9. ⏭️ Ajouter la messagerie asynchrone (RabbitMQ)
10. ⏭️ Tests et validation

## Support

Pour plus d'informations:
- Voir `README.md` pour la documentation complète
- Voir `DATABASE_SCHEMA.md` pour les détails des schémas
- Voir les README individuels dans chaque dossier de service
