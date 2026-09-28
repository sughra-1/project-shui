import { z } from 'zod';

// Validates the body when a new user registers
export const registerSchema = z.object({
    username : z.string('Username must be a string').trim().min(1, 'Username is required'),
    email    : z.email('Email must be a valid email'),
    password : z.string('Password must be a string').min(6, 'Password must be at least 6 characters'),
});

// Validates the body when a user logs in

export const loginSchema = z.object({
    username : z.string('Username must be a string!!').trim() .min(1, 'username is required'),
    password : z.string('Password must be a string!!').min(1, 'password is required'),
});

