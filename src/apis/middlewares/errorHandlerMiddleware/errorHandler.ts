// src/apis/middlewares/errorHandlerMiddleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError'; // Import your custom error class
import axios from "axios";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err); // Log the error for debugging purposes

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    // Handle unexpected errors
    res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred',
    });
};


export const handleAxiosError = (error: unknown ): string => {
    if (axios.isAxiosError(error)) {
        // Format Axios error response
        throw new Error(error.response ? JSON.stringify(error.response.data)  : error.message);
    } else if (error instanceof Error) {
        // Handle general Error instances
        throw new Error(error.message);
    } else {
        // Handle unknown errors
        throw new Error('An unknown error occurred');
    }
}

