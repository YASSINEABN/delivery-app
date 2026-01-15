-- Deliverer Service Database Initialization Script
-- This script creates the database and initializes it with the schema

-- Execute schema creation
.read schema.sql

-- Insert sample data for testing (optional)

-- Sample deliverers
INSERT INTO deliverers (
    employee_number, first_name, last_name, email, phone,
    date_of_birth, national_id, address, city, postal_code,
    emergency_contact_name, emergency_contact_phone,
    status, hire_date, rating, total_deliveries, successful_deliveries
) VALUES 
    (
        'DLV-001', 'Ahmed', 'Benali', 'ahmed.benali@delivery.com', '+33612345678',
        '1990-05-15', 'FR9005156789', '30 Rue Saint-Denis', 'Paris', '75002',
        'Fatima Benali', '+33612345679',
        'ACTIVE', '2024-01-15', 4.75, 1250, 1200
    ),
    (
        'DLV-002', 'Sophie', 'Laurent', 'sophie.laurent@delivery.com', '+33623456789',
        '1995-08-20', 'FR9508207890', '15 Avenue de la République', 'Lyon', '69002',
        'Marc Laurent', '+33623456790',
        'ACTIVE', '2024-03-01', 4.85, 980, 965
    ),
    (
        'DLV-003', 'Mohamed', 'Saidi', 'mohamed.saidi@delivery.com', '+33634567890',
        '1988-11-10', 'FR8811108901', '8 Boulevard Longchamp', 'Marseille', '13001',
        'Leila Saidi', '+33634567891',
        'ON_BREAK', '2023-06-10', 4.60, 2100, 2050
    ),
    (
        'DLV-004', 'Julie', 'Moreau', 'julie.moreau@delivery.com', '+33645678901',
        '1992-03-25', 'FR9203259012', '22 Rue Victor Hugo', 'Toulouse', '31000',
        'Pierre Moreau', '+33645678902',
        'ACTIVE', '2024-07-20', 4.90, 450, 448
    );

-- Sample deliverer vehicles
INSERT INTO deliverer_vehicles (
    deliverer_id, vehicle_type, make, model, year, license_plate, color,
    capacity_kg, is_active, insurance_number, insurance_expiry, registration_expiry
) VALUES 
    (1, 'SCOOTER', 'Piaggio', 'Liberty 125', 2022, 'AB-123-CD', 'Blanc', 15.0, 1, 'INS-2024-001', '2026-12-31', '2026-06-30'),
    (2, 'BIKE', 'Giant', 'FastRoad E+', 2023, 'EF-456-GH', 'Noir', 10.0, 1, 'INS-2024-002', '2026-11-30', '2026-05-31'),
    (3, 'MOTORCYCLE', 'Honda', 'PCX 125', 2021, 'IJ-789-KL', 'Rouge', 20.0, 1, 'INS-2024-003', '2026-10-31', '2026-04-30'),
    (4, 'CAR', 'Renault', 'Kangoo ZE', 2023, 'MN-012-OP', 'Bleu', 500.0, 1, 'INS-2024-004', '2027-01-31', '2026-08-31');

-- Sample deliverer documents
INSERT INTO deliverer_documents (
    deliverer_id, document_type, document_number, issue_date, expiry_date, status, verified_by, verified_at
) VALUES 
    (1, 'DRIVERS_LICENSE', 'DL-123456', '2020-01-15', '2030-01-15', 'VERIFIED', 'admin@delivery.com', datetime('now', '-30 days')),
    (1, 'ID_CARD', 'ID-789012', '2019-05-20', '2029-05-20', 'VERIFIED', 'admin@delivery.com', datetime('now', '-30 days')),
    (2, 'ID_CARD', 'ID-345678', '2020-08-15', '2030-08-15', 'VERIFIED', 'admin@delivery.com', datetime('now', '-25 days')),
    (3, 'DRIVERS_LICENSE', 'DL-901234', '2018-11-10', '2028-11-10', 'VERIFIED', 'admin@delivery.com', datetime('now', '-45 days')),
    (4, 'DRIVERS_LICENSE', 'DL-567890', '2021-03-25', '2031-03-25', 'VERIFIED', 'admin@delivery.com', datetime('now', '-15 days'));

-- Sample deliverer availability
INSERT INTO deliverer_availability (deliverer_id, day_of_week, start_time, end_time, is_available) VALUES 
    (1, 1, '08:00', '16:00', 1), -- Monday
    (1, 2, '08:00', '16:00', 1), -- Tuesday
    (1, 3, '08:00', '16:00', 1), -- Wednesday
    (1, 4, '08:00', '16:00', 1), -- Thursday
    (1, 5, '08:00', '16:00', 1), -- Friday
    (2, 1, '09:00', '18:00', 1),
    (2, 2, '09:00', '18:00', 1),
    (2, 3, '09:00', '18:00', 1),
    (2, 4, '09:00', '18:00', 1),
    (2, 5, '09:00', '18:00', 1),
    (2, 6, '10:00', '15:00', 1), -- Saturday
    (3, 2, '10:00', '19:00', 1),
    (3, 3, '10:00', '19:00', 1),
    (3, 4, '10:00', '19:00', 1),
    (3, 5, '10:00', '19:00', 1),
    (3, 6, '10:00', '19:00', 1),
    (4, 1, '07:00', '15:00', 1),
    (4, 2, '07:00', '15:00', 1),
    (4, 3, '07:00', '15:00', 1),
    (4, 4, '07:00', '15:00', 1),
    (4, 5, '07:00', '15:00', 1);

-- Sample deliverer shifts (today's shifts)
INSERT INTO deliverer_shifts (
    deliverer_id, shift_date, start_time, end_time, status,
    clock_in_time, clock_in_location, deliveries_completed
) VALUES 
    (1, date('now'), datetime('now', '-6 hours'), datetime('now', '+2 hours'), 'IN_PROGRESS', 
     datetime('now', '-6 hours'), 'Entrepôt Central Paris', 12),
    (2, date('now'), datetime('now', '-5 hours'), datetime('now', '+4 hours'), 'IN_PROGRESS',
     datetime('now', '-5 hours'), 'Entrepôt Lyon', 8),
    (4, date('now'), datetime('now', '-7 hours'), datetime('now', '+1 hour'), 'IN_PROGRESS',
     datetime('now', '-7 hours'), 'Entrepôt Toulouse', 15);

-- Sample deliverer locations (current locations)
INSERT INTO deliverer_locations (deliverer_id, latitude, longitude, location_name, accuracy, speed) VALUES 
    (1, 48.8566, 2.3522, 'Paris Centre', 10.5, 25.0),
    (2, 45.7640, 4.8357, 'Lyon Part-Dieu', 8.2, 30.0),
    (4, 43.6047, 1.4442, 'Toulouse Capitole', 12.0, 35.0);

-- Sample deliverer performance (last month)
INSERT INTO deliverer_performance (
    deliverer_id, period_start, period_end, total_deliveries, successful_deliveries,
    failed_deliveries, average_delivery_time, total_distance, average_rating,
    late_deliveries, on_time_deliveries, early_deliveries
) VALUES 
    (1, date('now', '-1 month', 'start of month'), date('now', '-1 day'), 
     250, 245, 5, 28, 450.5, 4.75, 8, 220, 17),
    (2, date('now', '-1 month', 'start of month'), date('now', '-1 day'),
     195, 193, 2, 25, 380.2, 4.85, 5, 175, 13),
    (3, date('now', '-1 month', 'start of month'), date('now', '-1 day'),
     350, 342, 8, 32, 680.8, 4.60, 15, 310, 25),
    (4, date('now', '-1 month', 'start of month'), date('now', '-1 day'),
     90, 90, 0, 22, 210.5, 4.90, 2, 80, 8);

-- Sample deliverer ratings
INSERT INTO deliverer_ratings (deliverer_id, delivery_id, customer_id, rating, comment) VALUES 
    (1, 1, 1, 5, 'Excellent service, très professionnel'),
    (2, 2, 2, 5, 'Rapide et courtois'),
    (1, 3, 3, 4, 'Bon service, légèrement en retard'),
    (2, 4, 1, 5, 'Parfait!');
