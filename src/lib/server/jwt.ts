/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "$env/static/private"
import type { Cookies } from '@sveltejs/kit';
import { dev } from '$app/environment';

const JWT_SECRET_VALUE = JWT_SECRET || 'your-very-secure-secret';

// Function to create JWT token
export const createToken = (payload: Record<string, any>) => {
    return jwt.sign(payload, JWT_SECRET_VALUE, { expiresIn: '30d' });
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

export function setSessionCookie(token: string, cookies: Cookies) {
    cookies.set('jwtToken', token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
        path: '/',
        secure: !dev,
    });
}
