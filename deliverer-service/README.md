# Deliverer Service

Service de gestion des livreurs et de leurs performances.

## Description
Gère les informations des livreurs, leurs véhicules, disponibilités et performances.

## Base de Données

### Tables
- **deliverers**: Informations des livreurs
- **deliverer_vehicles**: Véhicules
- **deliverer_documents**: Documents administratifs
- **deliverer_availability**: Disponibilités
- **deliverer_shifts**: Postes de travail
- **deliverer_locations**: Localisation GPS
- **deliverer_performance**: Métriques de performance
- **deliverer_ratings**: Évaluations clients

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
docker build -t delivery-app/deliverer-service:latest .
```

### Run
```bash
docker run -d -p 8003:8003 --name deliverer-service delivery-app/deliverer-service:latest
```

## API Endpoints

- `GET /health` - Health check
- `GET /api/deliverers` - Liste des livreurs
- `GET /api/deliverers/{id}` - Détails
- `POST /api/deliverers` - Créer un livreur
- `PUT /api/deliverers/{id}` - Mettre à jour
- `GET /api/deliverers/{id}/location` - Position GPS
- `GET /api/deliverers/{id}/performance` - Statistiques
- `GET /api/deliverers/available` - Livreurs disponibles

## Statuts de Livreur
- ACTIVE
- INACTIVE
- ON_BREAK
- OFF_DUTY
- SUSPENDED

## Types de Véhicules
- BIKE
- SCOOTER
- MOTORCYCLE
- CAR
- VAN
