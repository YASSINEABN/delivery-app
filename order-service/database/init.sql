-- Order Service Database Initialization Script
-- This script creates the database and initializes it with the schema

-- Execute schema creation
.read /app/database/schema.sql

-- Insert sample data for testing (optional)

-- Sample customers
INSERT INTO customers (first_name, last_name, email, phone, address, city, postal_code) 
VALUES 
    ('Jean', 'Dupont', 'jean.dupont@email.com', '+33123456789', '10 Rue de la Paix', 'Paris', '75001'),
    ('Marie', 'Martin', 'marie.martin@email.com', '+33123456790', '25 Avenue des Champs', 'Lyon', '69001'),
    ('Pierre', 'Bernard', 'pierre.bernard@email.com', '+33123456791', '15 Boulevard Victor Hugo', 'Marseille', '13001');

-- Sample orders
INSERT INTO orders (order_number, customer_id, status, total_amount, delivery_address, delivery_city, delivery_postal_code, delivery_fee, special_instructions) 
VALUES 
    ('ORD-2026-0001', 1, 'PENDING', 125.50, '10 Rue de la Paix', 'Paris', '75001', 5.00, 'Livraison avant 18h'),
    ('ORD-2026-0002', 2, 'CONFIRMED', 89.99, '25 Avenue des Champs', 'Lyon', '69001', 7.50, 'Appeler avant livraison'),
    ('ORD-2026-0003', 3, 'PROCESSING', 234.75, '15 Boulevard Victor Hugo', 'Marseille', '13001', 10.00, NULL);

-- Sample order items
INSERT INTO order_items (order_id, product_name, product_description, quantity, unit_price, total_price, weight, dimensions) 
VALUES 
    (1, 'Laptop HP', 'HP Pavilion 15.6 pouces', 1, 120.50, 120.50, 2.5, '38x25x2'),
    (2, 'Souris Sans Fil', 'Souris ergonomique Logitech', 2, 25.00, 50.00, 0.2, '10x6x4'),
    (3, 'Moniteur 27"', 'Écran 4K Dell', 1, 224.75, 224.75, 5.5, '65x45x10');

-- Sample order status history
INSERT INTO order_status_history (order_id, status, notes, changed_by) 
VALUES 
    (1, 'PENDING', 'Commande créée', 'SYSTEM'),
    (2, 'PENDING', 'Commande créée', 'SYSTEM'),
    (2, 'CONFIRMED', 'Commande confirmée par le client', 'customer@email.com'),
    (3, 'PENDING', 'Commande créée', 'SYSTEM'),
    (3, 'CONFIRMED', 'Commande confirmée', 'SYSTEM'),
    (3, 'PROCESSING', 'Préparation en cours', 'warehouse@email.com');
