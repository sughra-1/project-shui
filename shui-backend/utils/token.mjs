import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// How many times bcrypt processes the password (higher = safer but slower)
const SALT_ROUNDS = 10;

// Turns a plain password into a hash before saving it in the database
export const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

// Checks if a plain password matches the saved hash (returns true/false)
export const comparePassword = (password, hash) => bcrypt.compare(password, hash);

// Creates a signed token with user data that expires after 1 hour
export const signToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Checks the token and returns its data; throws an error if it is invalid or expired
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};
