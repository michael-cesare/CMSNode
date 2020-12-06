import { EWordpressEndpoints } from '@srcTypes/enums'; import {
  IFetchPostsRequest,
  IWPObject,
  IFetchResponse,
  IWpRepo,
  IWPMenu,
  IError,
} from '@srcTypes/models';
import { EWPTypes, EErrorsCodes } from '@srcTypes/enums';

import { formatUrl } from '@util/url.util';
import apiClient from '@util/api.util';
import { isEmpty, isArray, sizeOf } from '@util/core.util';

import { WordpressHelper } from '@helpers/wordpressHelper';

const fetchMenuEndpoint = EWordpressEndpoints.menuEndpoint;
const fetchPageEndpoint = EWordpressEndpoints.pagesEndpoint;
const fetchPostEndpoint = EWordpressEndpoints.postEndpoint;
const fetchPostsEndpoint = EWordpressEndpoints.postsEndpoint;

/**
 * This is the main class where to read from Wordpress Rest API endpoints.
 * Here we can also add Redis cache to reduce calling wordpress.
 */
class WpRepo implements IWpRepo {

  fetchMenu = async (): Promise<IFetchResponse> => {
    const fetchUrl = formatUrl(fetchMenuEndpoint, {})
    return apiClient.get(fetchUrl, {
      options: {
        isPublicPath: true,
      },
    })
    .then(this.parseWP)
    .catch(this.handleReject);
  }

  fetchPage = async (pageSlug: string): Promise<IFetchResponse> => {
    const fetchUrl = formatUrl(fetchPageEndpoint, { slug: pageSlug })
    return apiClient.get(fetchUrl, {
      options: {
        isPublicPath: true,
      },
    })
    .then(this.parseWP)
    .catch(this.handleReject);
  };

  fetchPost = async (slug: string): Promise<IFetchResponse> => {
    const fetchUrl = formatUrl(fetchPostEndpoint, { slug })
    return apiClient.get(fetchUrl, {
      options: {
        isPublicPath: true,
      },
    })
    .then(this.parseWP)
    .catch(this.handleReject);
  };

  fetchPosts = async (params: IFetchPostsRequest): Promise<IFetchResponse> => {
    const fetchUrl = formatUrl(fetchPostsEndpoint, params)
    return apiClient.get(fetchUrl, {
      options: {
        isPublicPath: true,
      },
    })
    .then(this.parseWP)
    .catch(this.handleReject);
  };

  parseWP = (response: any): Promise<IFetchResponse> =>
    new Promise((resolve: any, reject: any) => {
      const fetchPostsResponse: IFetchResponse = {
        data: [],
        errors: [],
      };
      const wpParsed = new WordpressHelper().objectParser(response);
      const type = response.type || EWPTypes.unknown;
      if (type === EWPTypes.menu) {
        fetchPostsResponse.data = wpParsed as IWPMenu;
      } else if (type === EWPTypes.page) {
        fetchPostsResponse.data = wpParsed as IWPObject;
      } else if (type === EWPTypes.post) {
        fetchPostsResponse.data = wpParsed as IWPObject;
      } else if (type === EWPTypes.posts) {
        fetchPostsResponse.data = wpParsed as Array<IWPObject>;
      } else if (!isEmpty(response) && isArray(response)) {
        fetchPostsResponse.data = wpParsed as Array<IWPObject>;
      } else if (!isEmpty(response) && sizeOf(response) > 0) {
        fetchPostsResponse.data = wpParsed as IWPObject;
      } else {
        reject('not parseable');
      }

      return resolve(fetchPostsResponse);
    });

  /** Handle errors by resolving promise and retunr error object in result */
  handleReject = (response: any): Promise<IFetchResponse> =>
    new Promise((resolve: any) => {
      const fetchPostsResponse: IFetchResponse = {
        data: [],
        errors: [],
      };
      const error: IError = {
        code: EErrorsCodes.FailedFetch,
        info: response,
      }
      const errors: Array<IError> = [];
      errors.push(error)
      fetchPostsResponse.errors = errors;

      return resolve(fetchPostsResponse);
    });

}

export default WpRepo;
