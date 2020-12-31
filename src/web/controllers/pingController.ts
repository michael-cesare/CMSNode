
import { Response, Request, Router } from 'express';

import timeouMiddleware from '@middleware/timeouMiddleware';

import ResponseHelper from '@helpers/ResponseHelper';
import logger from '@util/logger.util';

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

  public async HandleWebRequest(req: Request, res: Response): Promise<void> {
    try {
      logger.info(`[hit][PingController][HandleWebRequest] ${JSON.stringify(req.params)}`);
      res.sendFile(__dirname + '/web/ping.html');
    } catch (e) {
      logger.info(`[Error][PingController][HandleWebRequest] ${JSON.stringify(req.params)}`);
      ResponseHelper.WriteError(res, e);
    } finally {
      res.end();
    }
  };

}

export default (app: Router) => {
  const pingRouter = Router();
  app.use('/ping', pingRouter)
  const pingController = new PingController();
  pingRouter.get('/', timeouMiddleware(pingController.HandlePingRequest));
  pingRouter.get('/web', timeouMiddleware(pingController.HandleWebRequest));
}
