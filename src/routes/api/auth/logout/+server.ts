import { json } from "@sveltejs/kit"
import type { RequestEvent } from "../$types"
import { BaseResponse } from "$lib/server/response";
import { verifyToken } from "$lib/server/jwt";
import { HttpStatus } from "$lib/server/https_status";

export async function POST(event: RequestEvent) {
    const response = new BaseResponse()
    try {
        const authHeader = event.request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return {
                status: 400,
                body: { message: 'Token not provided or malformed' }
            };
        }
    
        const token = authHeader.split(' ')[1];

        // Decode token to get its expiration
        const decoded = verifyToken(token)
        if(!decoded || typeof decoded === "string") return json(response.setError(HttpStatus.UNAUTHORIZED, ''))
        response.setToken(undefined)

        return json(response.setSuccess(200, {}, "Logout Successfull"))


    } catch(err) {
        console.error(err)
        return json(response.setInternalError())
    }
}