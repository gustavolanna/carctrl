'use strict'
let winston = require('winston');
let logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'debug',
            filename: __dirname +'/../debug-log.log',
            handleExceptions: true,
            json: true,
            maxsize: (1024 * 1024 * 10), //10MB
            maxFiles: 3,
            tailable: true,
            colorize: false,
            prettyPrint: true
        }),
        new winston.transports.Console({
            level: 'debug',
            timestamp: true,
            handleExceptions: true,
            json: false,
            colorize: true,
            prettyPrint: true
        })
    ],
    exitOnError: false
});
winston.remove(winston.transports.Console);

module.exports = logger;