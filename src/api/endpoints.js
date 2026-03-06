import axiosInstance from './axios';

// Health Check Endpoints
export const healthAPI = {
  check: () => axiosInstance.get('/health'),
};

// Auth Endpoints
export const authAPI = {
  register: (data) => axiosInstance.post('/auth/register', data),
  login: (data) => axiosInstance.post('/auth/login', data),
  updateProfile: (data) => axiosInstance.put('/auth/profileupdate', data),
  updateAvailability: (isAvailable) => axiosInstance.patch('/auth/availability', { isAvailable }),
  forgotPassword: (email) => axiosInstance.post('/auth/forgot-password', { email }),
  resetPassword: (email, resetToken, newPassword) =>
    axiosInstance.post('/auth/reset-password', { email, resetToken, newPassword }),
  uploadProfileImage: (file, userId) => {
    const formData = new FormData();
    formData.append('image', file);
    const endpoint = userId ? `/auth/${userId}/profile-image` : '/auth/profile-image';
    return axiosInstance.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Categories Endpoints
export const categoriesAPI = {
  getAll: () => axiosInstance.get('/categories'),
  create: (data) => axiosInstance.post('/categories', data),
  update: (id, data) => axiosInstance.put(`/categories/${id}`, data),
  delete: (id) => axiosInstance.delete(`/categories/${id}`),
};

// Services Endpoints
export const servicesAPI = {
  getAll: (params) => axiosInstance.get('/services', { params }),
  getById: (id) => axiosInstance.get(`/services/${id}`),
  create: (data) => axiosInstance.post('/services', data),
  update: (id, data) => axiosInstance.put(`/services/${id}`, data),
  delete: (id) => axiosInstance.delete(`/services/${id}`),
};

// Bookings Endpoints
export const bookingsAPI = {
  create: (data) => axiosInstance.post('/bookings', data),
  getAll: () => axiosInstance.get('/bookings'),
  getById: (id) => axiosInstance.get(`/bookings/${id}`),
  accept: (id) => axiosInstance.patch(`/bookings/${id}/accept`),
  updateStatus: (id, status) => axiosInstance.patch(`/bookings/${id}/status`, { status }),
  cancel: (id) => axiosInstance.patch(`/bookings/${id}/cancel`),
  reschedule: (id, data) => axiosInstance.patch(`/bookings/${id}/reschedule`, data),
  addNotes: (id, data) => axiosInstance.patch(`/bookings/${id}/notes`, data),
};

// Reviews Endpoints
export const reviewsAPI = {
  create: (data) => axiosInstance.post('/reviews', data),
  getByProvider: (providerId) => axiosInstance.get(`/reviews/provider/${providerId}`),
  delete: (id) => axiosInstance.delete(`/reviews/${id}`),
};

// Admin Endpoints
export const adminAPI = {
  getStats: () => axiosInstance.get('/admin/stats'),
  getUsers: () => axiosInstance.get('/admin/users'),
  getBookings: () => axiosInstance.get('/admin/bookings'),
  approveProvider: (id) => axiosInstance.patch(`/admin/users/${id}/approve`),
  rejectProvider: (id) => axiosInstance.patch(`/admin/users/${id}/reject`),
};

// Provider approval management
// router.patch('/users/:providerid/approve', ...adminAuth, approveProvider);
// router.patch('/users/:providerId/reject', ...adminAuth, rejectProvider);


// Image Upload
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return axiosInstance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
