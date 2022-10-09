import * as appRootPath from 'app-root-path';
import * as morgan from 'morgan';
import * as rfs from 'rotating-file-stream';

// create a rotating write stream
const accessLogStream = rfs.createStream(
  `${appRootPath}/logs/access-logs/access.log`,
  {
    interval: '1d', // rotate daily
    size: '10M', // rotate every 10 MegaBytes written
    compress: 'gzip',
    // compress rotated files
  },
);
export const morganMiddleware = (token: string): any =>
  morgan(token, { stream: accessLogStream });

/*
  Morgan is a NodeJS middleware that is needed to customize request logs.
  Winston is a useful library that is needed to configure and customize the application logs
  */
