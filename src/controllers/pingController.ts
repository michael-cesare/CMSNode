
import express, { Response, Request } from 'express';

import asyncMiddleware from '@middleware/asyncMiddleware';

import ResponseHelper from '@helpers/ResponseHelper';
import logger from '@util/logger.util';

const pingRouter = express.Router();

class PingController {

  public async HandlePingRequest(req: Request, res: Response, next: any): Promise<void> {
    try {
      logger.info(`[hit][PingController][HandlePingRequest] ${JSON.stringify(req.params)}`);
      const message = '<div>pong</div>';

      ResponseHelper.WriteHTML(res, message);
    } catch (e) {
      logger.info(`[Error][PingController][HandlePingRequest] ${JSON.stringify(req.params)}`);
      ResponseHelper.WriteError(res, e);
    } finally {
      res.end();
    }
  };

}

// Create a Home Instance as singleton
const pingController = new PingController();

pingRouter.get('/ping', asyncMiddleware(pingController.HandlePingRequest));

export default pingRouter;
