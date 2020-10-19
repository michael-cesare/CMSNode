import 'module-alias/register';
import fs from 'fs';
import express, { Response, Request } from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import cors from 'cors';

import { EnvConfig } from "@config/envConfig";

import { favIconRoute } from '@middleware/favIconMiddleware';
import pingController from '@controllers/pingController';
import wordpressController from '@controllers/wordpressController';

import logger from '@util/logger.util';

const app = express();
const port = EnvConfig.port;
const httpServer = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

// Recourses

app.use(favIconRoute);

// REST API Handling

app.use(pingController);
app.use(wordpressController);

// Server Start

logger.info(`****************** STARTING ********************`);
httpServer.listen(port, () => logger.info(`Server is listenning`));
logger.info(`**********************************************`);

logger.info(`Server running on port ${port}`);

// Testing page
app.get('/pages/ping', (req:Request, res:Response) => {
    res.sendFile(__dirname + '/pages/ping.html');
});

// ---- errorHandler for unhandledRejection ----
process.on('unhandledRejection', (err: any) => {
    const error = `[unhandledRejection] ${err.stack}` || err.message;
    logger.log(error);
  });
