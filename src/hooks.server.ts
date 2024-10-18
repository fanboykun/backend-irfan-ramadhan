import type { Handle } from '@sveltejs/kit';
import type { Role } from '@prisma/client';
import { verifyToken } from '$lib/server/jwt';


export const handle: Handle = async ({ event, resolve }) => {
    const { url, request, locals } = event;
    const protectedRoutes = ['/api/transactions', '/api/products', '/api/customers', '/api/merchants'] 
    const isProtectedRoute = protectedRoutes.some(route => url.pathname.startsWith(route));
    // Check if the request is for the /transactions route
    if (isProtectedRoute) {
        const authHeader = request.headers.get('Authorization');
        
        // Check if the Authorization header is present and correctly formatted
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1]; // Extract the token
            
            try {
                // Verify the token
                const decoded = verifyToken(token) as { userId: string, email: string, role: Role };
                
                // Attach user information to locals for use in other parts of the app
                locals.user = {
                    id: decoded.userId,
                    email: decoded.email,
                    role: decoded.role
                };

                if(url.pathname.startsWith('/api/merchant') && decoded.role !== "MERCHANT") return forbiddenResponse()
                if(url.pathname.startsWith('/api/customers') && decoded.role !== "CUSTOMER") return forbiddenResponse()


            } catch (error) {
                console.error(error)
                // If the token is invalid or expired, deny access
                return new Response(JSON.stringify({ message: 'Unauthorized access' }), {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        } else {
            // No token provided, deny access
            return new Response(JSON.stringify({ message: 'Authorization token missing' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }

    // Proceed with the request if authorized
    return resolve(event);
};

const forbiddenResponse = () => {
    return new Response(JSON.stringify({ message: 'Unauthorized access' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
    });
}
