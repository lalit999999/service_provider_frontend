import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  city: z.string().min(2, 'City is required'),
  area: z.string().min(2, 'Area is required'),
  role: z.enum(['customer', 'provider'], {
    required_error: 'Please select a role',
  }),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const serviceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  city: z.string().min(2, 'City is required'),
  image: z.string().optional(),
});

export const bookingSchema = z.object({
  scheduledDate: z.string().min(1, 'Date is required'),
  address: z.string().min(5, 'Address is required'),
  notes: z.string().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5, 'Rating must be between 1 and 5'),
  comment: z.string().min(5, 'Comment must be at least 5 characters'),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().optional(),
});
