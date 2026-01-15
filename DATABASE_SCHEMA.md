# Architecture et Schémas de Base de Données

## Vue d'ensemble

Ce document décrit en détail les schémas de base de données pour chaque microservice de la plateforme de gestion des livraisons.

## 1. Order Service Database (orders.db)

### Diagramme des Relations

```
customers (1) ----< (N) orders
orders (1) ----< (N) order_items
orders (1) ----< (N) order_status_history
```

### Table: customers
Stocke les informations des clients.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identifiant unique |
| first_name | VARCHAR(100) | NOT NULL | Prénom |
| last_name | VARCHAR(100) | NOT NULL | Nom |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email |
| phone | VARCHAR(20) | NOT NULL | Téléphone |
| address | TEXT | NOT NULL | Adresse |
| city | VARCHAR(100) | NOT NULL | Ville |
| postal_code | VARCHAR(20) | NOT NULL | Code postal |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de mise à jour |

### Table: orders
Gère les commandes clients.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identifiant unique |
| order_number | VARCHAR(50) | UNIQUE, NOT NULL | Numéro de commande |
| customer_id | INTEGER | FK -> customers.id | Référence client |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'PENDING' | Statut |
| total_amount | DECIMAL(10,2) | NOT NULL | Montant total |
| delivery_address | TEXT | NOT NULL | Adresse de livraison |
| delivery_city | VARCHAR(100) | NOT NULL | Ville de livraison |
| delivery_postal_code | VARCHAR(20) | NOT NULL | Code postal |
| special_instructions | TEXT | NULL | Instructions spéciales |
| delivery_fee | DECIMAL(10,2) | DEFAULT 0.00 | Frais de livraison |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de mise à jour |

**Statuts possibles:** PENDING, CONFIRMED, PROCESSING, READY_FOR_DELIVERY, COMPLETED, CANCELLED

### Table: order_items
Détails des articles commandés.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identifiant unique |
| order_id | INTEGER | FK -> orders.id | Référence commande |
| product_name | VARCHAR(255) | NOT NULL | Nom du produit |
| product_description | TEXT | NULL | Description |
| quantity | INTEGER | NOT NULL | Quantité |
| unit_price | DECIMAL(10,2) | NOT NULL | Prix unitaire |
| total_price | DECIMAL(10,2) | NOT NULL | Prix total |
| weight | DECIMAL(10,2) | NULL | Poids en kg |
| dimensions | VARCHAR(100) | NULL | Dimensions (LxWxH cm) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de création |

### Table: order_status_history
Historique des changements de statut.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identifiant unique |
| order_id | INTEGER | FK -> orders.id | Référence commande |
| status | VARCHAR(50) | NOT NULL | Statut |
| notes | TEXT | NULL | Notes |
| changed_by | VARCHAR(100) | NULL | Auteur du changement |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date du changement |

---

## 2. Delivery Service Database (deliveries.db)

### Diagramme des Relations

```
deliveries (1) ----< (N) delivery_tracking
deliveries (1) ----< (N) delivery_status_history
deliveries (1) ----< (N) delivery_issues
deliveries (1) ----< (N) delivery_notifications
```

### Table: deliveries
Informations principales des livraisons.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identifiant unique |
| delivery_number | VARCHAR(50) | UNIQUE, NOT NULL | Numéro de livraison |
| order_id | INTEGER | NOT NULL | Référence à order (Order Service) |
| order_number | VARCHAR(50) | NOT NULL | Numéro de commande (dénormalisé) |
| deliverer_id | INTEGER | NULL | Référence livreur (Deliverer Service) |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'PENDING_ASSIGNMENT' | Statut |
| pickup_address | TEXT | NOT NULL | Adresse de récupération |
| pickup_city | VARCHAR(100) | NOT NULL | Ville de récupération |
| pickup_postal_code | VARCHAR(20) | NOT NULL | Code postal |
| delivery_address | TEXT | NOT NULL | Adresse de livraison |
| delivery_city | VARCHAR(100) | NOT NULL | Ville de livraison |
| delivery_postal_code | VARCHAR(20) | NOT NULL | Code postal |
| estimated_distance | DECIMAL(10,2) | NULL | Distance estimée (km) |
| estimated_duration | INTEGER | NULL | Durée estimée (minutes) |
| actual_distance | DECIMAL(10,2) | NULL | Distance réelle (km) |
| actual_duration | INTEGER | NULL | Durée réelle (minutes) |
| priority | VARCHAR(20) | DEFAULT 'NORMAL' | Priorité |
| scheduled_pickup_time | TIMESTAMP | NULL | Heure de récupération prévue |
| actual_pickup_time | TIMESTAMP | NULL | Heure de récupération réelle |
| estimated_delivery_time | TIMESTAMP | NULL | Heure de livraison estimée |
| actual_delivery_time | TIMESTAMP | NULL | Heure de livraison réelle |
| special_instructions | TEXT | NULL | Instructions spéciales |
| notes | TEXT | NULL | Notes |
| signature_data | TEXT | NULL | Signature (Base64) |
| proof_of_delivery_url | VARCHAR(500) | NULL | URL preuve de livraison |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de mise à jour |

**Statuts possibles:** PENDING_ASSIGNMENT, ASSIGNED, PICKED_UP, IN_TRANSIT, ARRIVED, DELIVERED, FAILED, CANCELLED

**Priorités:** URGENT, HIGH, NORMAL, LOW

### Table: delivery_tracking
Suivi GPS en temps réel.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identifiant unique |
| delivery_id | INTEGER | FK -> deliveries.id | Référence livraison |
| latitude | DECIMAL(10,8) | NULL | Latitude GPS |
| longitude | DECIMAL(11,8) | NULL | Longitude GPS |
| location_name | VARCHAR(255) | NULL | Nom du lieu |
| status | VARCHAR(50) | NOT NULL | Statut à ce point |
| description | TEXT | NULL | Description |
| timestamp | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Horodatage |

### Table: delivery_status_history
Historique des changements de statut.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identifiant unique |
| delivery_id | INTEGER | FK -> deliveries.id | Référence livraison |
| status | VARCHAR(50) | NOT NULL | Statut |
| notes | TEXT | NULL | Notes |
| latitude | DECIMAL(10,8) | NULL | Latitude GPS |
| longitude | DECIMAL(11,8) | NULL | Longitude GPS |
| changed_by | VARCHAR(100) | NULL | Auteur du changement |
| timestamp | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Horodatage |

### Table: delivery_issues
Problèmes rencontrés pendant la livraison.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identifiant unique |
| delivery_id | INTEGER | FK -> deliveries.id | Référence livraison |
| issue_type | VARCHAR(50) | NOT NULL | Type de problème |
| description | TEXT | NOT NULL | Description |
| resolution_status | VARCHAR(50) | DEFAULT 'OPEN' | Statut de résolution |
| reported_by | VARCHAR(100) | NULL | Rapporté par |
| resolved_by | VARCHAR(100) | NULL | Résolu par |
| reported_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date du rapport |
| resolved_at | TIMESTAMP | NULL | Date de résolution |

**Types de problèmes:** DELAY, DAMAGE, WRONG_ADDRESS, CUSTOMER_UNAVAILABLE, WEATHER, TRAFFIC, OTHER

**Statuts de résolution:** OPEN, IN_PROGRESS, RESOLVED, ESCALATED

### Table: delivery_notifications
Notifications envoyées.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identifiant unique |
| delivery_id | INTEGER | FK -> deliveries.id | Référence livraison |
| recipient_type | VARCHAR(50) | NOT NULL | Type de destinataire |
| recipient_id | VARCHAR(100) | NOT NULL | ID du destinataire |
| notification_type | VARCHAR(50) | NOT NULL | Type de notification |
| message | TEXT | NOT NULL | Message |
| sent_status | VARCHAR(20) | DEFAULT 'PENDING' | Statut d'envoi |
| sent_at | TIMESTAMP | NULL | Date d'envoi |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de création |

**Types de destinataires:** CUSTOMER, DELIVERER, ADMIN

**Types de notifications:** ASSIGNED, PICKED_UP, IN_TRANSIT, DELAY, ARRIVED, DELIVERED

**Statuts d'envoi:** PENDING, SENT, FAILED

---

## 3. Deliverer Service Database (deliverers.db)

### Diagramme des Relations

```
deliverers (1) ----< (N) deliverer_vehicles
deliverers (1) ----< (N) deliverer_documents
deliverers (1) ----< (N) deliverer_availability
deliverers (1) ----< (N) deliverer_shifts
deliverers (1) ----< (N) deliverer_locations
deliverers (1) ----< (N) deliverer_performance
deliverers (1) ----< (N) deliverer_ratings
```

### Table: deliverers
Informations des livreurs.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identifiant unique |
| employee_number | VARCHAR(50) | UNIQUE, NOT NULL | Numéro d'employé |
| first_name | VARCHAR(100) | NOT NULL | Prénom |
| last_name | VARCHAR(100) | NOT NULL | Nom |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email |
| phone | VARCHAR(20) | NOT NULL | Téléphone |
| date_of_birth | DATE | NULL | Date de naissance |
| national_id | VARCHAR(50) | NULL | Numéro ID national |
| address | TEXT | NOT NULL | Adresse |
| city | VARCHAR(100) | NOT NULL | Ville |
| postal_code | VARCHAR(20) | NOT NULL | Code postal |
| emergency_contact_name | VARCHAR(200) | NULL | Contact d'urgence |
| emergency_contact_phone | VARCHAR(20) | NULL | Téléphone d'urgence |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'INACTIVE' | Statut |
| hire_date | DATE | NOT NULL | Date d'embauche |
| termination_date | DATE | NULL | Date de fin de contrat |
| rating | DECIMAL(3,2) | DEFAULT 0.00 | Note moyenne /5 |
| total_deliveries | INTEGER | DEFAULT 0 | Nombre total de livraisons |
| successful_deliveries | INTEGER | DEFAULT 0 | Livraisons réussies |
| failed_deliveries | INTEGER | DEFAULT 0 | Livraisons échouées |
| profile_photo_url | VARCHAR(500) | NULL | URL photo de profil |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de mise à jour |

**Statuts possibles:** ACTIVE, INACTIVE, ON_BREAK, OFF_DUTY, SUSPENDED

### Table: deliverer_vehicles
Véhicules des livreurs.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identifiant unique |
| deliverer_id | INTEGER | FK -> deliverers.id | Référence livreur |
| vehicle_type | VARCHAR(50) | NOT NULL | Type de véhicule |
| make | VARCHAR(100) | NULL | Marque |
| model | VARCHAR(100) | NULL | Modèle |
| year | INTEGER | NULL | Année |
| license_plate | VARCHAR(20) | UNIQUE, NOT NULL | Plaque d'immatriculation |
| color | VARCHAR(50) | NULL | Couleur |
| capacity_kg | DECIMAL(10,2) | NULL | Capacité en kg |
| is_active | BOOLEAN | DEFAULT 1 | Actif |
| insurance_number | VARCHAR(100) | NULL | Numéro d'assurance |
| insurance_expiry | DATE | NULL | Expiration assurance |
| registration_expiry | DATE | NULL | Expiration immatriculation |
| last_maintenance_date | DATE | NULL | Dernière maintenance |
| next_maintenance_date | DATE | NULL | Prochaine maintenance |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de mise à jour |

**Types de véhicules:** BIKE, SCOOTER, MOTORCYCLE, CAR, VAN

### Table: deliverer_documents
Documents administratifs.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identifiant unique |
| deliverer_id | INTEGER | FK -> deliverers.id | Référence livreur |
| document_type | VARCHAR(50) | NOT NULL | Type de document |
| document_number | VARCHAR(100) | NULL | Numéro du document |
| document_url | VARCHAR(500) | NULL | URL du document |
| issue_date | DATE | NULL | Date d'émission |
| expiry_date | DATE | NULL | Date d'expiration |
| status | VARCHAR(50) | DEFAULT 'PENDING_VERIFICATION' | Statut |
| verified_by | VARCHAR(100) | NULL | Vérifié par |
| verified_at | TIMESTAMP | NULL | Date de vérification |
| notes | TEXT | NULL | Notes |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de création |

**Types de documents:** DRIVERS_LICENSE, ID_CARD, PASSPORT, INSURANCE, BACKGROUND_CHECK, CONTRACT

**Statuts:** PENDING_VERIFICATION, VERIFIED, EXPIRED, REJECTED

### Table: deliverer_availability
Disponibilités hebdomadaires.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identifiant unique |
| deliverer_id | INTEGER | FK -> deliverers.id | Référence livreur |
| day_of_week | INTEGER | NOT NULL | Jour (0=Dimanche, 6=Samedi) |
| start_time | TIME | NOT NULL | Heure de début |
| end_time | TIME | NOT NULL | Heure de fin |
| is_available | BOOLEAN | DEFAULT 1 | Disponible |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de mise à jour |

### Table: deliverer_shifts
Postes de travail.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identifiant unique |
| deliverer_id | INTEGER | FK -> deliverers.id | Référence livreur |
| shift_date | DATE | NOT NULL | Date du poste |
| start_time | TIMESTAMP | NOT NULL | Heure de début |
| end_time | TIMESTAMP | NULL | Heure de fin |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'SCHEDULED' | Statut |
| clock_in_time | TIMESTAMP | NULL | Heure d'arrivée |
| clock_out_time | TIMESTAMP | NULL | Heure de départ |
| clock_in_location | TEXT | NULL | Lieu d'arrivée |
| clock_out_location | TEXT | NULL | Lieu de départ |
| total_hours | DECIMAL(5,2) | NULL | Total d'heures |
| deliveries_completed | INTEGER | DEFAULT 0 | Livraisons complétées |
| notes | TEXT | NULL | Notes |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de création |

**Statuts:** SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW

### Table: deliverer_locations
Historique des positions GPS.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identifiant unique |
| deliverer_id | INTEGER | FK -> deliverers.id | Référence livreur |
| latitude | DECIMAL(10,8) | NOT NULL | Latitude GPS |
| longitude | DECIMAL(11,8) | NOT NULL | Longitude GPS |
| location_name | VARCHAR(255) | NULL | Nom du lieu |
| accuracy | DECIMAL(10,2) | NULL | Précision (mètres) |
| speed | DECIMAL(10,2) | NULL | Vitesse (km/h) |
| heading | DECIMAL(5,2) | NULL | Direction (degrés) |
| timestamp | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Horodatage |

### Table: deliverer_performance
Métriques de performance.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identifiant unique |
| deliverer_id | INTEGER | FK -> deliverers.id | Référence livreur |
| period_start | DATE | NOT NULL | Début de période |
| period_end | DATE | NOT NULL | Fin de période |
| total_deliveries | INTEGER | DEFAULT 0 | Total de livraisons |
| successful_deliveries | INTEGER | DEFAULT 0 | Livraisons réussies |
| failed_deliveries | INTEGER | DEFAULT 0 | Livraisons échouées |
| average_delivery_time | INTEGER | NULL | Temps moyen (minutes) |
| total_distance | DECIMAL(10,2) | NULL | Distance totale (km) |
| average_rating | DECIMAL(3,2) | NULL | Note moyenne |
| customer_complaints | INTEGER | DEFAULT 0 | Plaintes clients |
| late_deliveries | INTEGER | DEFAULT 0 | Livraisons en retard |
| on_time_deliveries | INTEGER | DEFAULT 0 | Livraisons à l'heure |
| early_deliveries | INTEGER | DEFAULT 0 | Livraisons en avance |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de création |

### Table: deliverer_ratings
Évaluations clients.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identifiant unique |
| deliverer_id | INTEGER | FK -> deliverers.id | Référence livreur |
| delivery_id | INTEGER | NOT NULL | Référence livraison |
| customer_id | INTEGER | NOT NULL | Référence client |
| rating | INTEGER | CHECK(1-5), NOT NULL | Note (1 à 5) |
| comment | TEXT | NULL | Commentaire |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de création |

---

## Index et Optimisations

### Order Service
- Index sur `customers.email`
- Index sur `orders.customer_id`, `orders.status`, `orders.created_at`
- Index sur `order_items.order_id`
- Index sur `order_status_history.order_id`

### Delivery Service
- Index sur `deliveries.order_id`, `deliveries.deliverer_id`, `deliveries.status`
- Index sur `delivery_tracking.delivery_id`, `delivery_tracking.timestamp`
- Index sur `delivery_status_history.delivery_id`
- Index sur `delivery_issues.delivery_id`, `delivery_issues.resolution_status`
- Index sur `delivery_notifications.delivery_id`, `delivery_notifications.sent_status`

### Deliverer Service
- Index sur `deliverers.status`, `deliverers.email`
- Index sur `deliverer_vehicles.deliverer_id`, `deliverer_vehicles.is_active`
- Index sur `deliverer_documents.deliverer_id`, `deliverer_documents.status`
- Index sur `deliverer_shifts.deliverer_id`, `deliverer_shifts.shift_date`
- Index sur `deliverer_locations.deliverer_id`, `deliverer_locations.timestamp`
- Index sur `deliverer_performance.deliverer_id`
- Index sur `deliverer_ratings.deliverer_id`, `deliverer_ratings.delivery_id`

## Triggers

### Order Service
- Trigger pour mettre à jour automatiquement `updated_at` sur `orders` et `customers`

### Delivery Service
- Trigger pour mettre à jour automatiquement `updated_at` sur `deliveries`
- Trigger pour créer automatiquement un enregistrement dans `delivery_status_history` lors d'un changement de statut

### Deliverer Service
- Trigger pour mettre à jour automatiquement `updated_at` sur `deliverers` et `deliverer_vehicles`
- Trigger pour recalculer automatiquement la note moyenne du livreur lors de l'ajout d'une nouvelle évaluation

## Données de Test

Chaque base de données est initialisée avec des données de test pour faciliter le développement et les tests:

- **Order Service**: 3 clients, 3 commandes avec articles
- **Delivery Service**: 3 livraisons avec suivi et notifications
- **Deliverer Service**: 4 livreurs avec véhicules, documents et performances

## Notes d'Implémentation

1. **Isolation des bases de données**: Chaque microservice possède sa propre base de données, conformément au principe d'isolation des microservices.

2. **Dénormalisation contrôlée**: Certaines données sont dénormalisées (ex: `order_number` dans `deliveries`) pour réduire les appels inter-services.

3. **Références externes**: Les ID faisant référence à d'autres services sont stockés comme simples entiers, la validation se fait au niveau applicatif.

4. **Timestamps**: Tous les enregistrements ont des timestamps de création et de mise à jour pour l'audit.

5. **Soft deletes**: Possibilité d'implémenter des suppressions logiques avec un champ `deleted_at` si nécessaire.
