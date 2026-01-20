-- Delivery Service Database Initialization Script
-- This script creates the database and initializes it with the schema

-- Execute schema creation
.read /app/database/schema.sql

-- Insert sample data for testing (optional)

-- Sample deliveries
INSERT INTO deliveries (
    delivery_number, order_id, order_number, deliverer_id, status,
    pickup_address, pickup_city, pickup_postal_code,
    delivery_address, delivery_city, delivery_postal_code,
    estimated_distance, estimated_duration, priority,
    scheduled_pickup_time, estimated_delivery_time, special_instructions
) VALUES 
    (
        'DEL-2026-0001', 1, 'ORD-2026-0001', 1, 'ASSIGNED',
        'Entrepôt Central, 50 Rue de Commerce', 'Paris', '75015',
        '10 Rue de la Paix', 'Paris', '75001',
        5.2, 25, 'HIGH',
        datetime('now', '+1 hour'), datetime('now', '+3 hours'),
        'Livraison avant 18h - Appeler avant'
    ),
    (
        'DEL-2026-0002', 2, 'ORD-2026-0002', 2, 'IN_TRANSIT',
        'Entrepôt Lyon, 100 Avenue Berthelot', 'Lyon', '69007',
        '25 Avenue des Champs', 'Lyon', '69001',
        8.5, 40, 'NORMAL',
        datetime('now', '-1 hour'), datetime('now', '+2 hours'),
        'Appeler 10 minutes avant arrivée'
    ),
    (
        'DEL-2026-0003', 3, 'ORD-2026-0003', NULL, 'PENDING_ASSIGNMENT',
        'Entrepôt Marseille, 200 Boulevard National', 'Marseille', '13003',
        '15 Boulevard Victor Hugo', 'Marseille', '13001',
        12.3, 50, 'URGENT',
        datetime('now', '+30 minutes'), datetime('now', '+2 hours'),
        'Client VIP - Priorité absolue'
    );

-- Sample delivery tracking data
INSERT INTO delivery_tracking (delivery_id, latitude, longitude, location_name, status, description) 
VALUES 
    (1, 48.8566, 2.3522, 'Entrepôt Central', 'ASSIGNED', 'Commande assignée au livreur'),
    (2, 45.7640, 4.8357, 'Départ entrepôt', 'PICKED_UP', 'Colis récupéré'),
    (2, 45.7700, 4.8300, 'En route - Rue de la République', 'IN_TRANSIT', 'En transit vers le client'),
    (2, 45.7750, 4.8250, 'Proche destination', 'IN_TRANSIT', '5 minutes de la destination');

-- Sample delivery status history
INSERT INTO delivery_status_history (delivery_id, status, notes, changed_by) 
VALUES 
    (1, 'PENDING_ASSIGNMENT', 'Livraison créée', 'SYSTEM'),
    (1, 'ASSIGNED', 'Assignée au livreur #1', 'dispatcher@delivery.com'),
    (2, 'PENDING_ASSIGNMENT', 'Livraison créée', 'SYSTEM'),
    (2, 'ASSIGNED', 'Assignée au livreur #2', 'dispatcher@delivery.com'),
    (2, 'PICKED_UP', 'Colis récupéré à l''entrepôt', 'deliverer@delivery.com'),
    (2, 'IN_TRANSIT', 'En route vers le client', 'deliverer@delivery.com'),
    (3, 'PENDING_ASSIGNMENT', 'Livraison créée', 'SYSTEM');

-- Sample delivery issues
INSERT INTO delivery_issues (delivery_id, issue_type, description, resolution_status, reported_by) 
VALUES 
    (2, 'TRAFFIC', 'Embouteillages importants sur l''Avenue Berthelot', 'IN_PROGRESS', 'deliverer@delivery.com');

-- Sample delivery notifications
INSERT INTO delivery_notifications (delivery_id, recipient_type, recipient_id, notification_type, message, sent_status) 
VALUES 
    (1, 'CUSTOMER', '1', 'ASSIGNED', 'Votre commande a été assignée à un livreur', 'SENT'),
    (1, 'DELIVERER', '1', 'ASSIGNED', 'Nouvelle livraison assignée: DEL-2026-0001', 'SENT'),
    (2, 'CUSTOMER', '2', 'PICKED_UP', 'Votre commande a été récupérée et est en route', 'SENT'),
    (2, 'CUSTOMER', '2', 'IN_TRANSIT', 'Votre livreur est en chemin', 'SENT'),
    (3, 'ADMIN', 'admin', 'URGENT', 'Livraison urgente en attente d''assignation', 'PENDING');
