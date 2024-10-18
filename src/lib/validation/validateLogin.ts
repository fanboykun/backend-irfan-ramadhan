import { Validator, type validateType } from "ts-input-validator"

/* eslint-disable @typescript-eslint/no-explicit-any */
export const validateUserLogin = (email: any, password: any) => {
    const toValidate: validateType[] = [
        {
            data: email, key: 'email', rules: ['required', 'string', 'email']
        },
        {
            data: password, key: 'password', rules: ['required', 'string']
        }
    ]
    return Validator.validate(toValidate)
}