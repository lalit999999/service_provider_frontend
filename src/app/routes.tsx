import { createBrowserRouter } from 'react-router';
import React, { lazy, Suspense } from 'react';
import { RoleRoute } from '../components/RoleRoute';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Layout } from '../components/Layout';
import { Loader2 } from 'lucide-react';

// Loading spinner for lazy routes
const LazyFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
      <p className="text-gray-500">Loading page...</p>
    </div>
  </div>
);

// Lazy load pages
const Home = lazy(() => import('../pages/public/Home').then(m => ({ default: m.Home })));
const Login = lazy(() => import('../pages/public/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('../pages/public/Register').then(m => ({ default: m.Register })));
const Categories = lazy(() => import('../pages/public/Categories').then(m => ({ default: m.Categories })));
const Services = lazy(() => import('../pages/public/Services').then(m => ({ default: m.Services })));
const ServiceDetails = lazy(() => import('../pages/public/ServiceDetails').then(m => ({ default: m.ServiceDetails })));

const CustomerDashboard = lazy(() => import('../pages/customer/CustomerDashboard').then(m => ({ default: m.CustomerDashboard })));
const ProviderDashboard = lazy(() => import('../pages/provider/ProviderDashboard').then(m => ({ default: m.ProviderDashboard })));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

// Helper to wrap lazy components in Suspense
const SuspenseWrap = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LazyFallback />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: (
          <SuspenseWrap>
            <Home />
          </SuspenseWrap>
        ),
      },
      {
        path: '/login',
        element: (
          <SuspenseWrap>
            <Login />
          </SuspenseWrap>
        ),
      },
      {
        path: '/register',
        element: (
          <SuspenseWrap>
            <Register />
          </SuspenseWrap>
        ),
      },
      {
        path: '/categories',
        element: (
          <SuspenseWrap>
            <Categories />
          </SuspenseWrap>
        ),
      },
      {
        path: '/services',
        element: (
          <SuspenseWrap>
            <Services />
          </SuspenseWrap>
        ),
      },
      {
        path: '/services/:id',
        element: (
          <SuspenseWrap>
            <ServiceDetails />
          </SuspenseWrap>
        ),
      },
      {
        path: '/dashboard/customer',
        element: (
          <SuspenseWrap>
            <ProtectedRoute>
              <RoleRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </RoleRoute>
            </ProtectedRoute>
          </SuspenseWrap>
        ),
      },
      {
        path: '/dashboard/provider',
        element: (
          <SuspenseWrap>
            <ProtectedRoute>
              <RoleRoute allowedRoles={['provider']}>
                <ProviderDashboard />
              </RoleRoute>
            </ProtectedRoute>
          </SuspenseWrap>
        ),
      },
      {
        path: '/dashboard/admin',
        element: (
          <SuspenseWrap>
            <ProtectedRoute>
              <RoleRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleRoute>
            </ProtectedRoute>
          </SuspenseWrap>
        ),
      },
      {
        path: '*',
        element: (
          <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-6">Page not found</p>
              <a
                href="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go back home
              </a>
            </div>
          </div>
        ),
      },
    ],
  },
]);
