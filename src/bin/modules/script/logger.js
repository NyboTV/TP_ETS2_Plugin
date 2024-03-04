const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const moment = require('moment-timezone')
moment.tz.setDefault('Europe/Berlin').locale('id');

const debugMode = process.argv.includes("--debugging")

const logDir = debugMode ? `src/bin/logs` : 'logs'
const isDebugMode = process.argv.includes('--debug');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const generalLoggerFormat = winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
});

// Definieren Sie die Logger ohne Transports zunächst
const generalLogger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({
            format: () => moment().format('DD-MM-YYYY HH:mm:ss')
        }),
        generalLoggerFormat
    ),
    transports: []
});

// Funktion zum Einrichten der Transports für die Logger
function setupLoggerTransports(callback) {
    const errorTransport = new DailyRotateFile({
        filename: `${logDir}/index/error-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        handleExceptions: false
    });

    const debugTransport = new DailyRotateFile({
        filename: `${logDir}/index/debug-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        level: 'debug',
        handleExceptions: false,
    });

    const infoTransport = new DailyRotateFile({
        filename: `${logDir}/index/info-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        level: 'info',
        handleExceptions: false,
    });

    generalLogger.clear();

    generalLogger.add(errorTransport);
    generalLogger.add(debugTransport);
    generalLogger.add(infoTransport);

    if (isDebugMode) {
        generalLogger.add(new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize(),
                generalLoggerFormat
            )
        }));
    } else {
        generalLogger.add(new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                generalLoggerFormat
            )
        }));
    }

    // Rufen Sie die Callback-Funktion auf, um anzuzeigen, dass die Transports eingerichtet sind
    if (typeof callback === 'function') {
        callback();
    }
}

setupLoggerTransports();

module.exports = {
    logger: generalLogger
};
