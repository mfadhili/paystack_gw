// src/logger/logger.ts
import winston from 'winston';
const LogstashTransport = require('winston-logstash/lib/winston-logstash-latest');

// src/logger/logger.ts
export const setupLogger = () => {
    const transports: winston.transport[] = [];

    // Always add console
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, ...meta }) => {
                    return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
                })
            )
        })
    );

    // Add logstash only in production
    if (process.env.NODE_ENV === 'production' && process.env.ENABLE_LOGSTASH === 'true') {
        const LogstashTransport = require('winston-logstash/lib/winston-logstash-latest');
        transports.push(
            new LogstashTransport({
                port: process.env.LOGSTASH_PORT || 5000,
                host: process.env.LOGSTASH_HOST || 'logstash',
                ssl_enable: false,
                max_connect_retries: 10,
                node_name: 'express-app',
                handleExceptions: true,
            })
        );
    }

    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports,
    });

    logger.on('error', (error) => {
        console.error('Logging failed:', error);
    });

    return logger;
};
