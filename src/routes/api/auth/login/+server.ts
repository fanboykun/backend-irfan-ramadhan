import { json } from "@sveltejs/kit"
import type { RequestEvent } from "../$types"
import { BaseResponse } from "$lib/server/response"
import { validateUserLogin } from "$lib/validation/loginValidation"
import { findUserByEmail } from "$lib/server/module/user"
import { Argon2id } from 'oslo/password';
import { HttpStatus } from "$lib/server/https_status"
import { createToken } from "$lib/server/jwt"
import { parseJson } from "$lib/server/request"

export async function POST(event: RequestEvent) {
    const response = new BaseResponse()

    try {
        const jsonData = await parseJson(event.request) // parse json
        if(jsonData.error) return json(response.setError(400, jsonData.error))  // check if the json is invalid

        const { email, password } = jsonData.data

        const [failed, error] = validateUserLogin(email, password)
        if(failed) return json(response.setError(401, 'Data is Invalid', error))

        const user = await findUserByEmail(email)
        if(!user) return json(response.setError(400, 'User not found!'))

        const isPasswordMatch = await new Argon2id().verify(user.password, password)
        if(!isPasswordMatch) return json(response.setError(400, 'Password did not match'))

        // Create a JWT token for the authenticated user
        const token = createToken({ userId: user.id, email: user.email, role: user.role });

        return json(response.setSuccess(HttpStatus.OK, { email: user.email, id: user.id }, 'Login Successfull', token))

    } catch (err) {
        console.error(err)
        return json(response.setInternalError())
    }
    
}