# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> **Note**: Replace with your actual backend API URL

### 2. Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### 3. Test the Application

#### Without Backend (Mock Data Mode)
The app includes mock data fallbacks, so you can explore the UI immediately:

1. Visit `http://localhost:5173`
2. Click "Register" to see the registration form
3. Browse services and categories (mock data will be displayed)

#### With Backend
Connect your Node.js + Express + MongoDB backend:

1. Ensure your backend is running on the URL specified in `.env`
2. Register a new account
3. Login and explore role-based dashboards

### 4. Test Different User Roles

#### Customer Flow
1. Register as "customer"
2. Browse services
3. Book a service
4. Track bookings in dashboard

#### Provider Flow
1. Register as "provider"
2. Create services in dashboard
3. Manage booking requests
4. Update booking status

#### Admin Flow
1. Backend admin account required
2. Access admin dashboard
3. Approve providers
4. Manage categories

## 📁 Key Files to Know

- `/src/api/axios.js` - Configure API base URL and interceptors
- `/src/context/AuthContext.jsx` - Authentication state management
- `/src/app/routes.ts` - Route configuration
- `/src/utils/validations.js` - Form validation schemas

## 🔧 Common Tasks

### Add a New API Endpoint
Edit `/src/api/endpoints.js`:

```javascript
export const myAPI = {
  getData: () => axiosInstance.get('/my-endpoint'),
};
```

### Create a New Page
1. Create component in `/src/pages/[role]/`
2. Add route in `/src/app/routes.ts`
3. Add navigation link in `/src/components/Navbar.jsx`

### Add Form Validation
1. Create schema in `/src/utils/validations.js`
2. Use with `react-hook-form`:

```javascript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mySchema } from '../utils/validations';

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(mySchema),
});
```

## 🐛 Troubleshooting

### API Connection Issues
- Check backend is running
- Verify `VITE_API_BASE_URL` in `.env`
- Check browser console for CORS errors

### Authentication Issues
- Clear localStorage: `localStorage.clear()`
- Check token in localStorage: `localStorage.getItem('token')`

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📦 Production Build

```bash
npm run build
```

Output will be in `/dist` directory.

## 🎯 Next Steps

1. Connect your backend API
2. Test all user flows
3. Customize styling
4. Add additional features
5. Deploy to Vercel/Netlify

## 💡 Tips

- The app uses mock data when API calls fail - great for development!
- All forms have validation - check `/src/utils/validations.js`
- Toast notifications show on all actions
- Role-based routing prevents unauthorized access

## 📚 Learn More

See [README.md](./README.md) for complete documentation.
