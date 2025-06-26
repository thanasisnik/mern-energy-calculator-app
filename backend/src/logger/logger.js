
require('dotenv').config();
require('winston-daily-rotate-file');
require('winston-mongodb');

const { format, createLogger, transports } = require('winston');
const { combine, timestamp, label, printf, colorize } = format;

const consoleFormat = combine(
    colorize(),
    label({ label:"Energy App"}),
    timestamp({format: "DD-MM-YYYY HH:mm:ss"}),
    printf( ({ level, message, label, timestamp }) => {
        return `[${timestamp} [${label}] ${level}: ${message} ]`
    })
)

const fileRotateTransport = new transports.DailyRotateFile({
    filename: "./logs/rotate-%DATE%.log", // Ex. logs/rotate-8-4-2025.log
    datePattern: "DD-MM-YYYY",
    maxFiles: "14d"
});

const logger = createLogger({
    level: 'info',
    format: combine(
        label({label: "Energy App"}),
        timestamp({format:"DD-MM-YYYY HH:mm:ss"}),
        format.json()
    ),
    transports: [
        new transports.Console({
            format: consoleFormat
        }), // we need it only for dev mode 

        fileRotateTransport,

        new transports.File({
            level: "warn",
            filename: 'logs/warn.log'
        }),

        new transports.File({
            level: "error",
            filename: 'logs/error.log'
        }),

        new transports.MongoDB({
            level: "warn",
            db: process.env.MONGODB_URI,
            collection: "server_logs",
            format: combine(
                format.timestamp(),
                format.json()
            )
        })
    ]
});

module.exports = logger;
