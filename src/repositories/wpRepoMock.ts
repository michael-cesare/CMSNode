import fs from 'fs';
import { EWordpressFiles } from '@srcTypes/enums';
import { IFetchPostsRequest, IFetchPostsResponse, IWpRepo } from '@srcTypes/models';
import logger from '@util/logger.util';
import { pathResolve } from '@util/path.util';
import { WordpressHelper } from '@helpers/wordpressHelper';

const fetchMenuEndpoint = EWordpressFiles.menu;
const fetchPageEndpoint = EWordpressFiles.page;
const fetchPostEndpoint = EWordpressFiles.post;
const fetchPostsEndpoint = EWordpressFiles.posts;

class WpRepoMock implements IWpRepo {

  fetchMenu = async (): Promise<any> => {
    const fetchUrl = pathResolve( fetchMenuEndpoint );
    logger.info(`[fetchMenu] readFile ${JSON.stringify(fetchUrl)}`);
    return fs.readFile(fetchUrl, (err:any, json:any) => {
      return JSON.parse(json);
    });
  }

  fetchPage = async (pageSlug:string): Promise<any> => {
    const fetchUrl = pathResolve( fetchPageEndpoint );
    logger.info(`[fetchPage] readFile ${JSON.stringify(fetchUrl)}`);
    return fs.readFile(fetchUrl, (err:any, json:any) => {
      return JSON.parse(json);
    });
  };

  fetchPost = async (slug:string): Promise<any> => {
    const fetchUrl = pathResolve( fetchPostEndpoint );
    logger.info(`[fetchPost] readFile ${JSON.stringify(fetchUrl)}`);
    return fs.readFile(fetchUrl, (err:any, json:any) => {
      return JSON.parse(json);
    });
  };

  fetchPosts = async (params:IFetchPostsRequest): Promise<IFetchPostsResponse> => {
    const fetchUrl = pathResolve( fetchPostsEndpoint );
    logger.info(`[fetchPosts] readFile ${JSON.stringify(fetchUrl)}`);
    return new Promise<IFetchPostsResponse>((resolve:any, reject:any) => {
      fs.readFile(fetchUrl, (err:any, json:any) => {
        const fetchPostsResponse:IFetchPostsResponse = {};
        if (err) {
          fetchPostsResponse.errors = [err];
          reject(fetchPostsResponse);
        }

        const postItems = JSON.parse(json);
        fetchPostsResponse.data = WordpressHelper.parsePosts(postItems);
        fetchPostsResponse.params = params;
        resolve(fetchPostsResponse);
      } );
    });
  };

}

export default WpRepoMock;
