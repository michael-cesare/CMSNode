import 'module-alias/register';
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import cors from 'cors';

import envConfig, { PORT } from "@config/envConfig";

import logger from '@util/logger.util';
import { pathResolve } from '@util/path.util';
import { readfile } from '@util/fs.util';

const initNode = async () => {
  const app = express();
  const port = PORT();
  const httpServer = http.createServer(app);
  
  // Configs
  app.enable('trust proxy')
  app.use(bodyParser.json({ limit: '100mb' }))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cors());
  
  // Initialize Server Routes
  await require('./startup').default({ expressApp: app })
  
  // ---- errorHandler for unhandledRejection ----
  process.on('unhandledRejection', (err: any) => {
    const error = `[unhandledRejection] ${err.stack}` || err.message;
    logger.log(error);
  });
  
  // Server Start
  logger.info(`****************** STARTING ********************`);
  httpServer.listen(port, () => logger.info(`Server is listenning on port ${port}`));
  logger.info(`**********************************************`);
}

const startNode = async (data: any) => {
  logger.log(`APP Configs: ${JSON.stringify(data)}`);
  envConfig.config = data;
  await initNode();
}

const errorCatcher = async (err: any) => {
  logger.log(`err ${JSON.stringify(err)}`);
}

const configFilePath = pathResolve("/public/config.json");
readfile(configFilePath, startNode, errorCatcher);
