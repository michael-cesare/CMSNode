import { EWordpressEndpoints } from '@srcTypes/enums';
import { IFetchPostsRequest, IWpRepo } from '@srcTypes/models';
import logger from '@util/logger.util';
import { formatUrl } from '@util/url.util';
import apiClient from '@util/api.util';

const fetchMenuEndpoint = EWordpressEndpoints.menuEndpoint;
const fetchPageEndpoint = EWordpressEndpoints.pagesEndpoint;
const fetchPostEndpoint = EWordpressEndpoints.postEndpoint;
const fetchPostsEndpoint = EWordpressEndpoints.postsEndpoint;

class WpRepo implements IWpRepo {

  fetchMenu = async (): Promise<any> => {
    const fetchUrl = formatUrl(fetchMenuEndpoint, {})
    logger.info(`[fetchPage] fetchMenu ${JSON.stringify(fetchMenuEndpoint)}`);
    return apiClient.get(fetchUrl, {
      options: {
        isPublicPath: true,
      },
    });
  }

  fetchPage = async (pageSlug:string): Promise<any> => {
    const fetchUrl = formatUrl(fetchPageEndpoint, { slug: pageSlug })
    logger.info(`[fetchPage] formatUrl ${JSON.stringify(fetchUrl)}`);
    return apiClient.get(fetchUrl, {
      options: {
        isPublicPath: true,
      },
    });
  };

  fetchPost = async (slug:string): Promise<any> => {
    const fetchUrl = formatUrl(fetchPostEndpoint, { slug })
    logger.info(`[fetchPost] formatUrl ${JSON.stringify(fetchUrl)}`);
    return apiClient.get(fetchUrl, {
      options: {
        isPublicPath: true,
      },
    });
  };

  fetchPosts = async (params:IFetchPostsRequest): Promise<any> => {
    const fetchUrl = formatUrl(fetchPostsEndpoint, params )
    logger.info(`[fetchPosts] formatUrl ${JSON.stringify(fetchUrl)}`);
    return apiClient.get(fetchUrl, {
      options: {
        isPublicPath: true,
      },
    });
  };

}

export default WpRepo;
