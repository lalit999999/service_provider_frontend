# Local Services Booking Platform - Frontend

A production-ready React frontend for a Local Services Booking Platform that connects customers with local service providers.

## Features

### 🎯 Core Functionality

- **Role-Based Access Control**: Customer, Provider, and Admin roles with dedicated dashboards
- **Service Booking System**: Complete booking lifecycle management (Requested → Confirmed → In-progress → Completed → Cancelled)
- **Category Management**: Browse and filter services by categories
- **Review System**: Customers can rate and review completed services
- **Real-time Status Updates**: Status-based action buttons and workflow validation

### 👤 User Roles

#### Customer
- Browse and search services by category and city
- Book services with date/time selection
- Upload images for service requests
- Track booking status
- Cancel or reschedule bookings
- Write reviews for completed services
- Manage profile

#### Provider
- Create and manage services
- Accept/reject booking requests
- Update booking status
- Add work notes
- Toggle availability (Online/Offline)
- View booking history

#### Admin
- View platform statistics
- Approve/reject provider applications
- Manage service categories
- Moderate reviews
- View user and booking analytics

## Tech Stack

- **React 18+** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **Axios** with interceptors for API calls
- **Tailwind CSS** for styling
- **React Hook Form** for form handling
- **Zod** for validation
- **Context API** for authentication state
- **Sonner** for toast notifications
- **Lucide React** for icons
- **date-fns** for date formatting

## Project Structure

```
src/
├── api/
│   ├── axios.js              # Axios instance with interceptors
│   └── endpoints.js          # API endpoint definitions
├── components/
│   ├── Navbar.jsx           # Main navigation
│   ├── ProtectedRoute.jsx   # Authentication guard
│   ├── RoleRoute.jsx        # Role-based route guard
│   ├── ServiceCard.jsx      # Service display card
│   ├── BookingCard.jsx      # Booking display with actions
│   └── StatusBadge.jsx      # Status indicator component
├── context/
│   └── AuthContext.jsx      # Authentication context
├── pages/
│   ├── public/
│   │   ├── Home.jsx         # Landing page
│   │   ├── Login.jsx        # Login page
│   │   ├── Register.jsx     # Registration page
│   │   ├── Categories.jsx   # Categories listing
│   │   ├── Services.jsx     # Services listing with filters
│   │   └── ServiceDetails.jsx # Service details & booking
│   ├── customer/
│   │   └── CustomerDashboard.jsx # Customer dashboard
│   ├── provider/
│   │   └── ProviderDashboard.jsx # Provider dashboard
│   └── admin/
│       └── AdminDashboard.jsx    # Admin dashboard
├── utils/
│   └── validations.js       # Zod validation schemas
└── app/
    ├── App.tsx              # Main app component
    └── routes.ts            # Route configuration
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Backend API running (Node.js + Express + MongoDB)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd local-services-platform
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update environment variables in `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

5. Start development server:
```bash
npm run dev
```

## API Integration

The frontend expects the following REST API endpoints:

### Auth
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Categories
- `GET /categories` - Get all categories
- `POST /categories` - Create category (admin only)
- `PUT /categories/:id` - Update category (admin only)
- `DELETE /categories/:id` - Delete category (admin only)

### Services
- `GET /services` - Get all services (with filters)
- `GET /services/:id` - Get service by ID
- `POST /services` - Create service (provider only)
- `PUT /services/:id` - Update service (provider only)
- `DELETE /services/:id` - Delete service (provider only)

### Bookings
- `POST /bookings` - Create booking
- `GET /bookings` - Get user bookings
- `PATCH /bookings/:id/accept` - Accept booking (provider)
- `PATCH /bookings/:id/status` - Update status (provider)
- `PATCH /bookings/:id/cancel` - Cancel booking
- `PATCH /bookings/:id/reschedule` - Reschedule booking
- `PATCH /bookings/:id/notes` - Add work notes (provider)

### Reviews
- `POST /reviews` - Create review
- `GET /reviews/provider/:id` - Get provider reviews
- `DELETE /reviews/:id` - Delete review (admin)

### Admin
- `GET /admin/stats` - Get platform statistics
- `GET /admin/users` - Get all users
- `GET /admin/bookings` - Get all bookings
- `PATCH /admin/providers/:id/approve` - Approve provider
- `PATCH /admin/providers/:id/reject` - Reject provider

### Upload
- `POST /upload` - Upload image to Cloudinary

All protected endpoints require the `Authorization: Bearer <token>` header.

## Authentication Flow

1. User registers with name, email, password, and role (customer/provider)
2. Login returns JWT token and user object
3. Token stored in localStorage
4. Axios interceptor attaches token to all requests
5. Auto-redirect on 401 (expired token)
6. Role-based dashboard routing

## Booking Workflow

The booking system enforces the following status flow:

```
Requested → Confirmed → In-progress → Completed
            ↓
        Cancelled
```

### Status-Based Actions

**Requested**:
- Customer: Cancel, Reschedule
- Provider: Accept, Reject

**Confirmed**:
- Customer: Reschedule
- Provider: Mark In-progress, Add Notes

**In-progress**:
- Provider: Mark Completed, Add Notes

**Completed**:
- Customer: Write Review (if not already reviewed)

## Key Features Implementation

### Protected Routes
Routes are protected using two HOCs:
- `ProtectedRoute`: Ensures user is authenticated
- `RoleRoute`: Ensures user has required role

### Form Validation
All forms use React Hook Form with Zod validators:
- Type-safe validation
- Error message handling
- Client-side validation before API calls

### Error Handling
- Global Axios interceptor for API errors
- Toast notifications for user feedback
- Graceful fallbacks with mock data for development

### State Management
- Context API for authentication state
- Local component state for UI state
- Axios interceptors for automatic token injection

## Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Environment Variables

Set the following environment variable for production:

```
VITE_API_BASE_URL=https://your-production-api.com/api
```

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

### Deploy to Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Set environment variables in Netlify dashboard
4. Deploy

## Development Notes

### Mock Data
The application includes mock data fallbacks for development when the API is not available. This allows frontend development to continue independently.

### Code Organization
- Components are kept small and focused
- Reusable components in `/components`
- Page-specific components in respective page files
- Validation schemas separated in `/utils`
- API calls centralized in `/api`

### Best Practices
- TypeScript for type safety
- Proper error handling
- Loading and empty states
- Responsive design
- Accessibility considerations
- Clean code separation

## Contributing

1. Follow the existing code structure
2. Use TypeScript/JSX consistently
3. Add proper error handling
4. Include loading states
5. Test all user flows
6. Ensure responsive design

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
