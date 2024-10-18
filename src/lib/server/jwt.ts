/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "$env/static/private"

const JWT_SECRET_VALUE = JWT_SECRET || 'your-very-secure-secret';

// Function to create JWT token
export const createToken = (payload: Record<string, any>) => {
    return jwt.sign(payload, JWT_SECRET_VALUE, { expiresIn: '1h' });
};

// Function to verify JWT token
export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET_VALUE);
    } catch (error) {
        console.error(error)
        return null;
    }
};
