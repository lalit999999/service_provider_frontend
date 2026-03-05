# API Integration Guide

This document describes the expected backend API structure for the Local Services Booking Platform.

## Base URL

Set in `.env` file:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

## Authentication

All protected endpoints require JWT token in header:

```
Authorization: Bearer <token>
```

Token is automatically attached by Axios interceptor after login.

---

## API Endpoints

### Authentication

#### Register User

```http
POST /auth/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer" // or "provider"
}
```

**Success Response (201):**

```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

#### Login User

```http
POST /auth/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

---

### Categories

#### Get All Categories

```http
GET /categories
```

**Success Response (200):**

```json
[
  {
    "_id": "category_id",
    "name": "Plumbing",
    "description": "Professional plumbing services"
  }
]
```

#### Create Category (Admin Only)

```http
POST /categories
Authorization: Bearer <admin_token>
```

**Request Body:**

```json
{
  "name": "Plumbing",
  "description": "Professional plumbing services"
}
```

#### Update Category (Admin Only)

```http
PUT /categories/:id
Authorization: Bearer <admin_token>
```

#### Delete Category (Admin Only)

```http
DELETE /categories/:id
Authorization: Bearer <admin_token>
```

---

### Services

#### Get All Services

```http
GET /services?category=<category_id>&city=<city_name>
```

**Query Parameters:**

- `category` (optional): Filter by category ID
- `city` (optional): Filter by city name

**Success Response (200):**

```json
[
  {
    "_id": "service_id",
    "title": "Professional Plumbing",
    "description": "Expert plumbing services",
    "category": {
      "_id": "category_id",
      "name": "Plumbing"
    },
    "provider": {
      "_id": "provider_id",
      "name": "John Plumber",
      "email": "john@example.com"
    },
    "price": 50,
    "city": "New York",
    "image": "https://cloudinary.com/image.jpg",
    "averageRating": 4.5,
    "reviewCount": 24
  }
]
```

#### Get Service by ID

```http
GET /services/:id
```

**Success Response (200):**

```json
{
  "_id": "service_id",
  "title": "Professional Plumbing",
  "description": "Expert plumbing services with 10+ years experience",
  "category": "category_id",
  "provider": {
    "_id": "provider_id",
    "name": "John Plumber"
  },
  "price": 50,
  "city": "New York",
  "image": "https://cloudinary.com/image.jpg",
  "averageRating": 4.5,
  "reviewCount": 24
}
```

#### Create Service (Provider Only)

```http
POST /services
Authorization: Bearer <provider_token>
```

**Request Body:**

```json
{
  "title": "Professional Plumbing",
  "description": "Expert plumbing services",
  "category": "category_id",
  "price": 50,
  "city": "New York",
  "image": "https://cloudinary.com/image.jpg"
}
```

#### Update Service (Provider Only)

```http
PUT /services/:id
Authorization: Bearer <provider_token>
```

#### Delete Service (Provider Only)

```http
DELETE /services/:id
Authorization: Bearer <provider_token>
```

---

### Bookings

#### Create Booking (Customer Only)

```http
POST /bookings
Authorization: Bearer <customer_token>
```

**Request Body:**

```json
{
  "service": "service_id",
  "scheduledDate": "2024-03-15T10:00:00Z",
  "address": "123 Main St, New York, NY 10001",
  "notes": "Please bring extra tools",
  "image": "https://cloudinary.com/image.jpg"
}
```

**Success Response (201):**

```json
{
  "_id": "booking_id",
  "service": "service_id",
  "customer": "customer_id",
  "provider": "provider_id",
  "status": "Requested",
  "scheduledDate": "2024-03-15T10:00:00Z",
  "address": "123 Main St",
  "notes": "Please bring extra tools",
  "totalPrice": 50
}
```

#### Get All Bookings (User's Bookings)

```http
GET /bookings
Authorization: Bearer <token>
```

**Success Response (200):**

```json
[
  {
    "_id": "booking_id",
    "service": {
      "_id": "service_id",
      "title": "Professional Plumbing"
    },
    "customer": {
      "_id": "customer_id",
      "name": "John Doe"
    },
    "provider": {
      "_id": "provider_id",
      "name": "Jane Provider"
    },
    "status": "Confirmed",
    "scheduledDate": "2024-03-15T10:00:00Z",
    "address": "123 Main St",
    "totalPrice": 50,
    "notes": "Customer notes",
    "workNotes": "Provider work notes",
    "hasReview": false
  }
]
```

#### Accept Booking (Provider Only)

```http
PATCH /bookings/:id/accept
Authorization: Bearer <provider_token>
```

**Success Response (200):**

```json
{
  "message": "Booking accepted",
  "booking": {
    /* updated booking */
  }
}
```

#### Update Booking Status (Provider Only)

```http
PATCH /bookings/:id/status
Authorization: Bearer <provider_token>
```

**Request Body:**

```json
{
  "status": "In-progress" // or "Completed"
}
```

**Allowed Status Transitions:**

- `Confirmed` → `In-progress`
- `In-progress` → `Completed`

#### Cancel Booking

```http
PATCH /bookings/:id/cancel
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "message": "Booking cancelled",
  "booking": {
    /* updated booking */
  }
}
```

#### Reschedule Booking

```http
PATCH /bookings/:id/reschedule
Authorization: Bearer <customer_token>
```

**Request Body:**

```json
{
  "scheduledDate": "2024-03-20T14:00:00Z"
}
```

#### Add Work Notes (Provider Only)

```http
PATCH /bookings/:id/notes
Authorization: Bearer <provider_token>
```

**Request Body:**

```json
{
  "workNotes": "Replaced main pipe. All done."
}
```

---

### Reviews

#### Create Review (Customer Only)

```http
POST /reviews
Authorization: Bearer <customer_token>
```

**Request Body:**

```json
{
  "booking": "booking_id",
  "service": "service_id",
  "provider": "provider_id",
  "rating": 5,
  "comment": "Excellent service!"
}
```

**Success Response (201):**

```json
{
  "_id": "review_id",
  "booking": "booking_id",
  "customer": {
    "_id": "customer_id",
    "name": "John Doe"
  },
  "service": "service_id",
  "provider": "provider_id",
  "rating": 5,
  "comment": "Excellent service!",
  "createdAt": "2024-03-10T12:00:00Z"
}
```

#### Get Provider Reviews

```http
GET /reviews/provider/:providerId
```

**Success Response (200):**

```json
[
  {
    "_id": "review_id",
    "customer": {
      "name": "John Doe"
    },
    "rating": 5,
    "comment": "Excellent service!",
    "createdAt": "2024-03-10T12:00:00Z"
  }
]
```

#### Delete Review (Admin Only)

```http
DELETE /reviews/:id
Authorization: Bearer <admin_token>
```

---

### Admin Endpoints

#### Get Platform Statistics (Admin Only)

```http
GET /admin/stats
Authorization: Bearer <admin_token>
```

**Success Response (200):**

```json
{
  "totalUsers": 150,
  "totalBookings": 450,
  "revenue": 12500,
  "activeProviders": 45
}
```

#### Get All Users (Admin Only)

```http
GET /admin/users
Authorization: Bearer <admin_token>
```

**Success Response (200):**

```json
[
  {
    "_id": "user_id",
    "name": "John Provider",
    "email": "john@example.com",
    "role": "provider",
    "isApproved": false,
    "createdAt": "2024-03-01T10:00:00Z"
  }
]
```

#### Get All Bookings (Admin Only)

```http
GET /admin/bookings
Authorization: Bearer <admin_token>
```

#### Approve Provider (Admin Only)

```http
PATCH /admin/providers/:id/approve
Authorization: Bearer <admin_token>
```

**Success Response (200):**

```json
{
  "message": "Provider approved",
  "user": {
    /* updated user */
  }
}
```

#### Reject Provider (Admin Only)

```http
PATCH /admin/providers/:id/reject
Authorization: Bearer <admin_token>
```

---

### File Upload

#### Upload Image

```http
POST /upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**

```
image: <file>
```

**Success Response (200):**

```json
{
  "url": "https://res.cloudinary.com/your-cloud/image.jpg",
  "public_id": "cloudinary_public_id"
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "message": "Validation error",
  "errors": {
    "email": "Invalid email format"
  }
}
```

### 401 Unauthorized

```json
{
  "message": "Authentication required"
}
```

### 403 Forbidden

```json
{
  "message": "You do not have permission to perform this action"
}
```

### 404 Not Found

```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "message": "Internal server error"
}
```

---

## Testing with Mock Backend

If you don't have a backend yet, the frontend includes mock data fallbacks. You can:

1. Start the frontend without a backend
2. See mock data in action
3. Build your backend to match these API specs
4. Replace mock data with real API calls

---

## CORS Configuration

Your backend should allow requests from the frontend origin:

```javascript
// Express.js example
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend dev server
    credentials: true,
  }),
);
```

For production, update to your deployed frontend URL.

---

## Database Models Reference

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['customer', 'provider', 'admin']),
  isApproved: Boolean (for providers),
  createdAt: Date,
  updatedAt: Date
}
```

### Service Model

```javascript
{
  title: String,
  description: String,
  category: ObjectId (ref: 'Category'),
  provider: ObjectId (ref: 'User'),
  price: Number,
  city: String,
  image: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Model

```javascript
{
  service: ObjectId (ref: 'Service'),
  customer: ObjectId (ref: 'User'),
  provider: ObjectId (ref: 'User'),
  status: String (enum: ['Requested', 'Confirmed', 'In-progress', 'Completed', 'Cancelled']),
  scheduledDate: Date,
  address: String,
  notes: String,
  workNotes: String,
  totalPrice: Number,
  image: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

### Review Model

```javascript
{
  booking: ObjectId (ref: 'Booking'),
  service: ObjectId (ref: 'Service'),
  customer: ObjectId (ref: 'User'),
  provider: ObjectId (ref: 'User'),
  rating: Number (1-5),
  comment: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Category Model

```javascript
{
  name: String (unique),
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```
