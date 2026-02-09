import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs-extra';

const LOG_DIR = path.join(process.cwd(), 'logs');
fs.ensureDirSync(LOG_DIR);

// Custom format for file logging (no colors)
const fileFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
});

// Custom format for console logging (with colors)
const consoleFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] [${level}]: ${message}`;
});

export const logger = winston.createLogger({
    level: 'debug',
    transports: [
        // Console Transport
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.colorize(),
                consoleFormat
            )
        }),
        // File Transport (Daily Rotate)
        new winston.transports.DailyRotateFile({
            filename: path.join(LOG_DIR, 'plugin-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                fileFormat
            )
        })
    ]
});
