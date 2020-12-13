import { Response, Request, Router } from 'express';

import asyncMiddleware from '@middleware/asyncMiddleware';
import coreService from '@services/coreService';

import ResponseHelper from '@helpers/ResponseHelper';
import logger from '@util/logger.util';
import { isNullOrUndefined, isEmpty, sizeOf } from '@util/core.util';
import { IFetchPostsRequest } from '@srcTypes/models';

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

  /**
   * Route that handles plain pages only.
   * Pages may have dynamic data that requires posts, this will be handled by the coreService.
   * @param req 
   * @param res 
   * @param next 
   */
  public async HandlePageRequest(req: Request, res: Response, next: any): Promise<void> {
    try {
      const { pageSlug } = req.params;
      const slug = isNullOrUndefined(pageSlug) || isEmpty(pageSlug) ? '' : pageSlug;

      const fetchPageResult = await coreService.fetchPage(slug);

      ResponseHelper.WriteResult(res, fetchPageResult);
    } catch (e) {
      logger.info(`[Error][HandlePageRequest] ${JSON.stringify(req.params)}`);
      ResponseHelper.WriteError(res, e);
    } finally {
      res.end();
    }
  };

  /**
   * Route that handles both single and listing pages for any post types.
   * It specifically designed for wordpress post types.
   */
  public async HandlePostPageRequest(req: Request, res: Response, next: any): Promise<void> {

    try {
      const { postType, postSlug } = req.params;
      // route requires posttype.. make sure its present, else go to next route.
      if (isNullOrUndefined(postType) || isEmpty(postType)) {
        next()
      } else {
        const isList = isEmpty(postSlug) && isNullOrUndefined(postSlug);
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
        const fetchPostsResult = await coreService.fetchPostsPage(isList, postsParams);

        // if the post type does not exists in wordpress, exist route and try next() one
        if (isEmpty(fetchPostsResult) || sizeOf(fetchPostsResult) <= 0) {
          next()
        } else {
          ResponseHelper.WriteResult(res, fetchPostsResult);
          res.end();
        }
      }
    } catch (e) {
      logger.info(`[Error][HandlePostRequest] ${JSON.stringify(req.params)} ${JSON.stringify(e)}`);
      ResponseHelper.WriteError(res, e);
      res.end();
    }
  };
}

export default async (app: Router) => {
  const wordpressRouter = Router();
  app.use('/wp', wordpressRouter)
  const wordpressController = new WordpressController();

  wordpressRouter.get('/menu', asyncMiddleware(wordpressController.HandleMenuRequest));
  wordpressRouter.get('/home', asyncMiddleware(wordpressController.HandleHomeRequest));
  wordpressRouter.get('/:postType/:postSlug?', asyncMiddleware(wordpressController.HandlePostPageRequest));
  wordpressRouter.get('/:pageSlug', asyncMiddleware(wordpressController.HandlePageRequest));
  wordpressRouter.get('/', asyncMiddleware(wordpressController.HandleHomeRequest));
}
