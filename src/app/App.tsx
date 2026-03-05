import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'sonner';
import { router } from './routes';
import { Loader2 } from 'lucide-react';

const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingFallback />}>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster position="top-right" richColors closeButton />
    </AuthProvider>
  );
}
