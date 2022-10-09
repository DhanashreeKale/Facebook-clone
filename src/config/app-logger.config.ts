/*
--app-root-path: This simple module helps you access your application's root path from anywhere 
                in the application without resorting to relative paths like require("../../path")
--winston: simple and universal logging library
--winston-daily-rotate-file: The DailyRotateFile transport can rotate files by minute, hour, day, month, year or weekday
NOTE:log rotation is an automated process used in system administration in which log files are compressed, moved (archived), 
renamed or deleted once they are too old or too big
*/
import * as appRootPath from 'app-root-path';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const loggerFormat = winston.format.printf((info) => {
  return `${process.env.APP_NAME} ${info.timestamp}  ${info.level} :  ${info.message} `;
});

const Logger = winston.createLogger({
  level: 'silly', //least important severity level
  exitOnError: false, //If false, handled exceptions will not cause process.exit
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.cli(), //built-in logging format
    winston.format.splat(), //String interpolation splat for %d %s-style messages.
    loggerFormat,
  ),
  transports: [
    new DailyRotateFile({
      level: 'debug',
      filename: `${appRootPath}/logs/application-%DATE%-logs.log`,
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      format: winston.format.json(),
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.cli(),
        winston.format.splat(),
        loggerFormat,
      ),
    }),
  ],
});

export const logger = Logger;
