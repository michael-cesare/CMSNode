import express, { Response, Request } from 'express';

import asyncMiddleware from '@middleware/asyncMiddleware';
import coreService from '@services/coreService';

import ResponseHelper from '@helpers/ResponseHelper';
import logger from '@util/logger.util';
import { isNullOrUndefined } from '@util/core.util';
import { IFetchPostsRequest } from '@srcTypes/models';

const wordpressRouter = express.Router();

class WordpressController {

  public async HandleMenuRequest(req: Request, res: Response, next: any): Promise<void> {
    try {
      const message = await coreService.fetchMenu();

      ResponseHelper.WriteResult(res, message);
    } catch (e) {
      logger.info(`[Error][HandleMenuRequest] ${JSON.stringify(req.params)}`);
      ResponseHelper.WriteError(res, e);
    } finally {
      res.end();
    }
  };

  public async HandleHomeRequest(req: Request, res: Response, next: any): Promise<void> {
    try {
      const pageSlug = 'home';
      const fetchPageResult = await coreService.fetchPage(pageSlug);

      ResponseHelper.WriteResult(res, fetchPageResult);
    } catch (e) {
      logger.info(`[Error][HandleHomeRequest] ${JSON.stringify(req.params)}`);
      ResponseHelper.WriteError(res, e);
    } finally {
      res.end();
    }
  };

  public async HandlePageRequest(req: Request, res: Response, next: any): Promise<void> {
    try {
      const pageSlug = 'wordpress-page';
      const fetchPageResult = await coreService.fetchPage(pageSlug);

      ResponseHelper.WriteResult(res, fetchPageResult);
    } catch (e) {
      logger.info(`[Error][HandlePageRequest] ${JSON.stringify(req.params)}`);
      ResponseHelper.WriteError(res, e);
    } finally {
      res.end();
    }
  };

  public async HandlePostRequest(req: Request, res: Response, next: any): Promise<void> {
    try {
      const { postType, postSlug } = req.params;

      if (isNullOrUndefined(postType)) {
        res.sendStatus(500);
      }
      const isSingle = (isNullOrUndefined(postSlug));
      const postsParams: IFetchPostsRequest = {
        postType,
        postSlug,
        searchCount: 0,
        sortOrder: '',
        pageSize: 99,
        pageIndex: 0,
        termSlugs: '',
        taxonomy: '',
      };
      const fetchPostsResult = await coreService.fetchPosts(isSingle, postsParams);

      ResponseHelper.WriteResult(res, fetchPostsResult);
    } catch (e) {
      logger.info(`[Error][HandlePostRequest] ${JSON.stringify(req.params)}`);
      ResponseHelper.WriteError(res, e);
    } finally {
      res.end();
    }
  };
}

// Create a Home Instance as singleton
const wordpressController = new WordpressController();

wordpressRouter.get('/menu', asyncMiddleware(wordpressController.HandleMenuRequest));
wordpressRouter.get('/home', asyncMiddleware(wordpressController.HandleHomeRequest));
wordpressRouter.get('/:postType(posts|careers)(/:postSlug)?', asyncMiddleware(wordpressController.HandlePostRequest));
wordpressRouter.get('/:pageSlug', asyncMiddleware(wordpressController.HandlePageRequest));
wordpressRouter.get('/', asyncMiddleware(wordpressController.HandleHomeRequest));


export default wordpressRouter;
