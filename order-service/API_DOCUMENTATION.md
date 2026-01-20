# Order Service API Documentation

## Base URL
```
http://localhost:8001/api
```

## Endpoints

### Customer Endpoints

#### 1. Create Customer
**POST** `/api/customers`

**Request Body:**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@email.com",
  "phone": "+33123456789",
  "address": "10 Rue de la Paix",
  "city": "Paris",
  "postalCode": "75001"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@email.com",
  "phone": "+33123456789",
  "address": "10 Rue de la Paix",
  "city": "Paris",
  "postalCode": "75001"
}
```

#### 2. Get Customer by ID
**GET** `/api/customers/{id}`

**Response:** `200 OK`

#### 3. Get Customer by Email
**GET** `/api/customers/email/{email}`

**Response:** `200 OK`

#### 4. Get All Customers
**GET** `/api/customers`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@email.com",
    "phone": "+33123456789",
    "address": "10 Rue de la Paix",
    "city": "Paris",
    "postalCode": "75001"
  }
]
```

#### 5. Update Customer
**PUT** `/api/customers/{id}`

**Request Body:** (same as create)

**Response:** `200 OK`

#### 6. Delete Customer
**DELETE** `/api/customers/{id}`

**Response:** `204 No Content`

---

### Order Endpoints

#### 1. Create Order
**POST** `/api/orders`

**Request Body:**
```json
{
  "customerId": 1,
  "deliveryAddress": "10 Rue de la Paix",
  "deliveryCity": "Paris",
  "deliveryPostalCode": "75001",
  "specialInstructions": "Livraison avant 18h",
  "deliveryFee": 5.00,
  "items": [
    {
      "productName": "Laptop HP",
      "productDescription": "HP Pavilion 15.6 pouces",
      "quantity": 1,
      "unitPrice": 120.50,
      "weight": 2.5,
      "dimensions": "38x25x2"
    },
    {
      "productName": "Souris Sans Fil",
      "productDescription": "Souris ergonomique Logitech",
      "quantity": 2,
      "unitPrice": 25.00,
      "weight": 0.2,
      "dimensions": "10x6x4"
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "orderNumber": "ORD-20260120141530",
  "customerId": 1,
  "customer": {
    "id": 1,
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@email.com",
    "phone": "+33123456789",
    "address": "10 Rue de la Paix",
    "city": "Paris",
    "postalCode": "75001"
  },
  "status": "PENDING",
  "totalAmount": 175.50,
  "deliveryAddress": "10 Rue de la Paix",
  "deliveryCity": "Paris",
  "deliveryPostalCode": "75001",
  "specialInstructions": "Livraison avant 18h",
  "deliveryFee": 5.00,
  "items": [
    {
      "id": 1,
      "productName": "Laptop HP",
      "productDescription": "HP Pavilion 15.6 pouces",
      "quantity": 1,
      "unitPrice": 120.50,
      "totalPrice": 120.50,
      "weight": 2.5,
      "dimensions": "38x25x2"
    },
    {
      "id": 2,
      "productName": "Souris Sans Fil",
      "productDescription": "Souris ergonomique Logitech",
      "quantity": 2,
      "unitPrice": 25.00,
      "totalPrice": 50.00,
      "weight": 0.2,
      "dimensions": "10x6x4"
    }
  ],
  "createdAt": "2026-01-20T14:15:30",
  "updatedAt": "2026-01-20T14:15:30"
}
```

#### 2. Get Order by ID
**GET** `/api/orders/{id}`

**Response:** `200 OK`

#### 3. Get Order by Order Number
**GET** `/api/orders/number/{orderNumber}`

**Example:** `/api/orders/number/ORD-20260120141530`

**Response:** `200 OK`

#### 4. Get All Orders
**GET** `/api/orders`

**Query Parameters:**
- `customerId` (optional): Filter by customer ID
- `status` (optional): Filter by order status
- `page` (optional): Page number for pagination
- `size` (optional): Page size for pagination
- `sort` (optional): Sort criteria (e.g., `createdAt,desc`)

**Examples:**
- Get all orders: `/api/orders`
- Get orders by customer: `/api/orders?customerId=1`
- Get orders by status: `/api/orders?status=PENDING`
- Get orders with pagination: `/api/orders?page=0&size=10&sort=createdAt,desc`

**Response:** `200 OK` (returns list or Page object depending on pagination)

#### 5. Update Order
**PUT** `/api/orders/{id}`

**Request Body:**
```json
{
  "deliveryAddress": "15 Rue de la Paix",
  "deliveryCity": "Paris",
  "deliveryPostalCode": "75001",
  "specialInstructions": "Nouvelle instruction"
}
```

**Response:** `200 OK`

#### 6. Update Order Status
**PATCH** `/api/orders/{id}/status`

**Request Body:**
```json
{
  "status": "CONFIRMED",
  "notes": "Commande confirmée par le client",
  "changedBy": "customer@email.com"
}
```

**Response:** `200 OK`

**Available Statuses:**
- `PENDING`
- `CONFIRMED`
- `PROCESSING`
- `READY_FOR_DELIVERY`
- `COMPLETED`
- `CANCELLED`

#### 7. Get Order Status History
**GET** `/api/orders/{id}/history`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "status": "PENDING",
    "notes": "Order created",
    "changedBy": "SYSTEM",
    "createdAt": "2026-01-20T14:15:30"
  },
  {
    "id": 2,
    "status": "CONFIRMED",
    "notes": "Commande confirmée par le client",
    "changedBy": "customer@email.com",
    "createdAt": "2026-01-20T14:20:00"
  }
]
```

#### 8. Delete Order
**DELETE** `/api/orders/{id}`

**Response:** `204 No Content`

---

## Error Responses

### 400 Bad Request (Validation Error)
```json
{
  "timestamp": "2026-01-20T14:15:30",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid input data",
  "path": "/api/orders",
  "validationErrors": {
    "customerId": "Customer ID is required",
    "items": "Order must have at least one item"
  }
}
```

### 404 Not Found
```json
{
  "timestamp": "2026-01-20T14:15:30",
  "status": 404,
  "error": "Not Found",
  "message": "Order not found with ID: 999",
  "path": "/api/orders/999"
}
```

### 409 Conflict (Duplicate)
```json
{
  "timestamp": "2026-01-20T14:15:30",
  "status": 409,
  "error": "Conflict",
  "message": "Customer already exists with email: test@email.com",
  "path": "/api/customers"
}
```

### 500 Internal Server Error
```json
{
  "timestamp": "2026-01-20T14:15:30",
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "path": "/api/orders"
}
```

---

## Testing Examples with curl

### Create a Customer
```bash
curl -X POST http://localhost:8001/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@email.com",
    "phone": "+33123456789",
    "address": "10 Rue de la Paix",
    "city": "Paris",
    "postalCode": "75001"
  }'
```

### Create an Order
```bash
curl -X POST http://localhost:8001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "deliveryAddress": "10 Rue de la Paix",
    "deliveryCity": "Paris",
    "deliveryPostalCode": "75001",
    "specialInstructions": "Livraison avant 18h",
    "deliveryFee": 5.00,
    "items": [
      {
        "productName": "Laptop HP",
        "productDescription": "HP Pavilion 15.6 pouces",
        "quantity": 1,
        "unitPrice": 120.50,
        "weight": 2.5,
        "dimensions": "38x25x2"
      }
    ]
  }'
```

### Get All Orders
```bash
curl http://localhost:8001/api/orders
```

### Update Order Status
```bash
curl -X PATCH http://localhost:8001/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "CONFIRMED",
    "notes": "Order confirmed",
    "changedBy": "admin@deliveryapp.com"
  }'
```

### Get Order History
```bash
curl http://localhost:8001/api/orders/1/history
```
