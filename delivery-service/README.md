# Delivery Service

Service de gestion et suivi des livraisons.

## Description
Gère le cycle de vie des livraisons, le suivi en temps réel et les notifications.

## Base de Données

### Tables
- **deliveries**: Livraisons
- **delivery_tracking**: Points de suivi GPS
- **delivery_status_history**: Historique des statuts
- **delivery_issues**: Problèmes rencontrés
- **delivery_notifications**: Notifications envoyées

## Installation

### Initialisation de la base de données
```bash
cd database
chmod +x create_db.sh
./create_db.sh
```

### Configuration
```bash
cp .env.example .env
```

### Installation des dépendances
```bash
pip install -r requirements.txt
```

## Docker

### Build
```bash
docker build -t delivery-app/delivery-service:latest .
```

### Run
```bash
docker run -d -p 8002:8002 --name delivery-service delivery-app/delivery-service:latest
```

## API Endpoints

- `GET /health` - Health check
- `GET /api/deliveries` - Liste des livraisons
- `GET /api/deliveries/{id}` - Détails
- `POST /api/deliveries` - Créer une livraison
- `PUT /api/deliveries/{id}` - Mettre à jour
- `GET /api/deliveries/{id}/track` - Suivi en temps réel
- `POST /api/deliveries/{id}/track` - Ajouter point de suivi

## Statuts de Livraison
- PENDING_ASSIGNMENT
- ASSIGNED
- PICKED_UP
- IN_TRANSIT
- ARRIVED
- DELIVERED
- FAILED
- CANCELLED

## Communication
- REST API synchrone
- WebSocket pour suivi temps réel
- RabbitMQ pour notifications asynchrones
