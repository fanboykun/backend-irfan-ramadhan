import type { validated } from "ts-input-validator";
import type { HttpStatus } from "./https_status";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type BaseResponseType = {
    success: boolean;
    status: number;
    data: Record<string, any>;
    message?: string;
    error?: validated[] | any;
};

export class BaseResponse {
    success: boolean;
    status: number;
    data: Record<string, any>;
    message?: string;
    error?: validated[] | any;

    constructor() {
        this.success = true;
        this.status = 200; // Default to internal server error
        this.data = {};
        this.message = undefined;
        this.error = undefined;
    }

    /**
     * Set response data with success status, message, and data.
     */
    setSuccess(status: number|HttpStatus, data: Record<string, any>, message?: string): BaseResponse {
        this.success = true;
        this.status = status;
        this.data = data;
        this.message = message;
        this.error = undefined; // Clear error on success
        return this;
    }

    /**
     * Set response with an error, including status, message, and optional error details.
     */
    setError(status: number|HttpStatus, message: string, error?: validated[] | any): BaseResponse {
        this.success = false;
        this.status = status;
        this.message = message;
        this.error = error;
        return this;
    }

    /**
     * Set a default error response by merging an existing response object with new values.
     */
    static setDefaultErrorResponse(response: BaseResponseType, value: BaseResponseType): BaseResponseType {
        return { ...response, ...value };
    }
}
