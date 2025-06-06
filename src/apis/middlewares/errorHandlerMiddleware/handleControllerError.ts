// src/apis/middlewares/errorHandlerMiddleware/handleControllerError.ts
import { Response } from 'express';
import mongoose from "mongoose";

export const handleControllerError = (res: Response, error: unknown, message: string, statusCode = 400 ) => {
    // console.log("handleControllerError: ", res, message, statusCode);
    console.error("handleControllerError: ",error); // Log the error for debugging

    if (error instanceof mongoose.Error.ValidationError) {
        const validationErrors: Record<string, string> = {};
        for (const [field, err] of Object.entries(error.errors)) {
            validationErrors[field] = (err as any).message;
        }

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationErrors
        });
    }

    const errMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    error instanceof Error ? console.error('error stack',error.stack) : console.error('errMessage ',errMessage);
    console.error('errMessage: ',errMessage)
    res.status(statusCode).json({
        success: false,
        status: 'error',
        details: errMessage || null
    });
};
