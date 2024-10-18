import type { validated } from "ts-input-validator";
import { HttpStatus } from "./https_status";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type BaseResponseType = {
    success: boolean;
    status: number;
    data: Record<string, any>;
    message?: string;
    error?: validated[] | any;
    token?: string
};

export class BaseResponse {
    success: boolean;
    status: number;
    data: Record<string, any>;
    message?: string;
    error?: validated[] | any;
    token?: string;

    constructor() {
        this.success = true;
        this.status = 200; // Default to internal server error
        this.data = {};
        this.message = undefined;
        this.error = undefined;
        this.token = undefined
    }

    /**
     * Set response data with success status, message, and data.
     */
    setSuccess(status: number|HttpStatus, data: Record<string, any>, message?: string, token?: string): BaseResponse {
        this.success = true;
        this.status = status;
        this.data = data;
        this.message = message;
        this.error = undefined; // Clear error on success
        this.token = token
        return this;
    }

    /**
     * Set response with an error, including status, message, and optional error details.
     */
    setError(status: number|HttpStatus, message: string, error?: validated[] | any, token?: string): BaseResponse {
        this.success = false;
        this.status = status;
        this.message = message;
        this.error = error;
        this.token = token
        return this;
    }

    /**
     * Set a default error response by merging an existing response object with new values.
     */
    static setDefaultErrorResponse(response: BaseResponseType, value: BaseResponseType): BaseResponseType {
        return { ...response, ...value };
    }

    setInternalError() {
        return this.setError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error')
    }

    setToken(token?: string) {
        this.token = token
        return this
    }

    toString() {
        return JSON.stringify(this)
    }
}
