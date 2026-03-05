

Local Services Booking Platform – MERN Compatible)


Build a production-ready React frontend for a Local Services Booking Platform.

The frontend must connect to an existing Node.js + Express + MongoDB backend API.

The application must support:

Customer

Service Provider

Admin

The focus is on:

Role-based UI

Booking lifecycle visualization

Status-based action buttons

Clean dashboards

No broken workflows

Do not overcomplicate UI design. Keep it clean and functional.

This frontend will connect to an existing REST API backend.

Use modern best practices and clean architecture.

🧱 Tech Stack Requirements

React 18+

Vite

React Router DOM

Axios (with interceptors)

Tailwind CSS

React Hook Form

Zod (validation)

Context API (Auth state)

Cloudinary for image upload (via backend)

Toast notifications

Protected routes

Role-based dashboards

Optional (if needed for speed):

Firebase Realtime Database instead of Socket.io

React Query for API state caching

Zustand instead of Context API

Do NOT use Redux.

🌍 Roles in the System

There are 3 roles:

customer

provider

admin

Authentication uses JWT stored in localStorage.

Every protected route must validate:

user exists

role matches required permission

🔐 Authentication Flow

Pages Required:

/login

/register

Register fields:

name

email

password

role (customer or provider only)

Login returns:

token

user object

Store token in localStorage.
Attach token to all protected API calls using Axios interceptor.

After login:

customer → redirect to /dashboard/customer

provider → redirect to /dashboard/provider

admin → redirect to /dashboard/admin

🏠 Public Pages
1. Home Page (/)

Display service categories

CTA buttons

Search by city input

2. Categories Page (/categories)

Fetch and display all categories

3. Services Listing Page (/services)

Filters:

category

city

Each service card shows:

provider name

service title

price

rating

“Book Now” button

Click → navigate to service details page

🛠 Service Details Page (/services/:id)

Display:

Service title

Provider info

Description

Pricing

Location

Reviews list

Customer can:

Select date/time

Enter address

Add notes

Upload optional image

View total price before confirmation

Submit booking

📅 Booking Workflow (Critical)

Booking Status Flow:

Requested → Confirmed → In-progress → Completed → Cancelled

You must enforce UI logic based on status.

👤 Customer Dashboard (/dashboard/customer)

Tabs:

My Bookings

List bookings

Show status badge

Show action buttons:

Cancel (only if Requested)

Reschedule (if Requested or Confirmed)

Reviews

Can review only if booking status = Completed

Cannot review twice

Rating (1–5)

Text comment

Profile

Edit profile

👷 Provider Dashboard (/dashboard/provider)

Tabs:

My Services

Create service

Edit service

Delete service

Booking Requests

Accept booking

Reject booking

Change status:

Confirmed → In-progress

In-progress → Completed

Work Notes

Add notes

Upload before/after images

Toggle Availability (Online/Offline)

🛡 Admin Dashboard (/dashboard/admin)

Sections:

Approve Providers

View pending providers

Approve / Reject

Manage Categories

Create

Edit

Delete

Moderate Reviews

Delete inappropriate reviews

Platform Stats

Total users

Total bookings

Revenue

Active providers

🖼 Image Upload

Use file input component.

Upload flow:

Send image to backend

Backend uploads to Cloudinary

Backend returns image URL

Store image URL in database

Preview image before upload.

📂 Frontend Folder Structure
src/
 ├── api/
 │    ├── axios.js
 │    └── endpoints.js
 ├── components/
 │    ├── Navbar.jsx
 │    ├── ProtectedRoute.jsx
 │    ├── RoleRoute.jsx
 │    ├── ServiceCard.jsx
 │    ├── BookingCard.jsx
 │    └── StatusBadge.jsx
 ├── context/
 │    └── AuthContext.jsx
 ├── pages/
 │    ├── public/
 │    ├── customer/
 │    ├── provider/
 │    └── admin/
 ├── hooks/
 ├── utils/
 └── App.jsx

🔁 Required API Endpoints

Use these REST endpoints:

Auth:

POST /auth/register

POST /auth/login

Categories:

GET /categories

POST /categories (admin)

Services:

GET /services

GET /services/:id

POST /services (provider)

Bookings:

POST /bookings

GET /bookings

PATCH /bookings/:id/accept

PATCH /bookings/:id/status

PATCH /bookings/:id/cancel

Reviews:

POST /reviews

GET /reviews/provider/:id

Admin:

GET /admin/stats

GET /admin/users

GET /admin/bookings

All protected routes require Authorization header:
Bearer <token>

🎨 UI Requirements

Clean Tailwind design

Responsive layout

Proper loading states

Proper empty states

Toast notifications

Error handling UI

Disabled buttons when action not allowed

🧠 State Management Rules

Auth state in Context API

Keep minimal global state

Use local component state for forms

Use Axios interceptors for token injection

Optional:
Use React Query to manage API caching and invalidation.

⚡ Performance & Clean Code Rules

Lazy load dashboard pages

Create reusable form components

Use separate validation schemas

Avoid prop drilling

Keep components small and focused

Use proper folder separation

🚀 Deployment Requirements

Frontend:

Deploy to Vercel or Netlify

Environment variable:
VITE_API_BASE_URL

Must run in production mode without errors.

🎯 Important Engineering Constraints

Enforce role-based UI restrictions

Prevent invalid booking status transitions

Prevent review before completion

Prevent provider modifying other provider services

Prevent admin-only routes from public access

No broken flows allowed.

🏁 Expected Output

Generate:

Full folder structure

All main pages

Core reusable components

Auth context

Axios setup

Routing setup

Example booking flow

Example dashboard layout

Example form validation

Do not generate backend code.

Focus on clean frontend architecture with working API integration.