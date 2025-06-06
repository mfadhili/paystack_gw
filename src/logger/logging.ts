import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import axios from 'axios';
import os from 'os';

const hostname = os.hostname();

export const customLoggingMiddleware = (logger: winston.Logger) => {

    // Log outbound requests (e.g., Axios)
    axios.interceptors.request.use((config) => {
        logger.info({
            message: 'Outbound Request',
            method: config.method,
            url: config.url,
            headers: config.headers,
            payload: config.data,
            host: hostname
        });
        return config;
    });

    axios.interceptors.response.use(
        (response) => {
            logger.info({
                message: 'Outbound Response',
                status: response.status,
                url: response.config.url,
                payload: response.data,
                host: hostname
            });
            return response;
        },
        (error) => {
            logger.error({
                message: 'Outbound Request Error',
                errorMessage: error.message,
                status: error.response?.status,
                url: error.config?.url,
                responsePayload: error.response?.data,
                host: hostname
            });
            return Promise.reject(error);
        }
    );

    return (req: Request, res: Response, next: NextFunction) => {
        const startTime = Date.now();

        res.on('finish', () => {
            const responseTime = Date.now() - startTime;

            logger.info({
                message: 'Request Info',
                method: req.method,
                url: req.originalUrl,
                status: res.statusCode,
                responseTime: `${responseTime}ms`,
                requestPayload: req.body,
                responsePayload: res.locals.responsePayload || {},
                host: hostname
            });
        });

        next();
    };
};
