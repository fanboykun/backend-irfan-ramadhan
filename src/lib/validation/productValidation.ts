import { Validator, type validateType } from "ts-input-validator"

/* eslint-disable @typescript-eslint/no-explicit-any */
export const validateAddProduct = (name: any, price: any) => {
    const toValidate: validateType[] = [
        {
            data: name, key: 'name', rules: ['required', 'string',]
        },
        {
            data: price, key: 'price', rules: ['required', 'number', 'min:1000']
        },

    ]
    return Validator.validate(toValidate)
}

export const validateEditProduct = (id: any, name: any, price: any) => {
    const toValidate: validateType[] = [
        {
            data: id, key: 'id', rules: ['required', 'string',]
        },
        {
            data: name, key: 'name', rules: ['required', 'string',]
        },
        {
            data: price, key: 'price', rules: ['required', 'number', 'min:1000']
        },

    ]
    return Validator.validate(toValidate)
}