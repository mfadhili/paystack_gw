// src/middlewares/errorHandlerMiddleware/handleServiceError.ts

/**
 * Handles errors in the service layer by logging them and re-throwing for controllers to catch.
 * @param {string} context - The context or description of the error (e.g., "Logout Service Error").
 * @param {any} error - The error object or message.
 */
export const handleServiceError = (context: string, error: any): void => {
    // Log the error to the console or an external logger
    console.error(`[${context}]`, error.message || error);

    // Optionally log the stack trace for debugging
    if (error.stack) {
        console.error(`Stack Trace: ${error.stack}`);
    }

    // Re-throw the error so it can be handled in the controller
    throw new Error(error.message || 'An unexpected error occurred');
};
