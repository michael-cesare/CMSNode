// import fetch from 'isomorphic-fetch';
import https from 'https';

import logger from '@util/logger.util';
import { isDev } from '@util/url.util';

import { EnvConfig } from "@config/envConfig";

const rootUrl = EnvConfig.siteUrl;

enum EFetchMethods {
  get = 'get',
  post = 'post',
  put = 'put',
  delete = 'delete',
}

const acceptHeader = 'Accept';
const contentTypeHeader = 'Content-Type';
const authHeader = 'Authorization';
const contentType = 'application/json';

const formatUrl = (path:any) => {
  const adjustedPath = path[0] !== '/' ? '/'.concat(path) : path;

  return adjustedPath;
};

const checkStatus = (response:any) => {
  if (response.status && response.status >= 200 && response.status < 300) {
    return response;
  }

  logger.log(`[ApiClient][checkStatus][Error]: ${response.statusText}`);
  const error = new Error(response.statusText);
  throw error;
};

const parseJson = (response:any) => {
  // Only parse when there is actually content to parse
  if (response && response.statusText && response.statusText === 'No Content') {
    logger.log(`[ApiClient][parseJson][EMPTY]: response: ${JSON.stringify(response)}`);

    return '';
  }

  return response && response.text
    ? response.text().then((v:any) => (v && v !== '' ? JSON.parse(v) : {}))
    : response;
};

const serializeParams = (obj:any) => {
  const str = [];

  for (const property in obj) {
    if (obj.hasOwnProperty(property) && obj[property]) {
      // encodeURI does not encode these separators (; / ? : @ & = + $ , #). encodeURIComponent decodes all
      str.push(encodeURI(property).concat('=', encodeURI(obj[property])));
    }
  }

  return str.join('&');
};

const agent = new https.Agent({
  rejectUnauthorized: false,
});

/**
 * Summary. Wrapper for isomorphic-fetch which makes HTTP Requests
 *
 * Description. This is wrapper for isomorphic-fetch. Method available: get, post, put, delete. This methods will return a promise result, either a reject or a success.
 * 
 * @class ApiClient classname used for HTTP Requests.
 */
class ApiClient {
  baseUrl: string;
  tokenGetter: any | undefined;

  /**
   * Summary. Wrapper for isomorphic-fetch which makes HTTP Requests
   * @param {string} baseUrl API Url that is used by isomorphic-fetch
   * @param {*} tokenGetter you can inject a token getter that will add token in requests
   */
  constructor(baseUrl:string, tokenGetter:any = undefined) {
    this.baseUrl = baseUrl;
    this.tokenGetter = tokenGetter;
  }

  private fetch = (method:EFetchMethods, path:string, { params, data, options }:any = {}): Promise<any> => {
    return new Promise((resolve:any, reject:any) => {
        // const handler = async () => {
        const adjustedPath = formatUrl(path);
        let url = this.baseUrl + adjustedPath;
        const token = this.tokenGetter ? this.tokenGetter() : '';
        // logger.hit(`[ApiClient]: ${url}`);

        const init = {
          method,
          headers: {
            [acceptHeader]: contentType,
          },
        } as any;

        if ((!options || !(options.isPublicPath))
          && token) {
          init.headers[authHeader] = 'Bearer '.concat(token);
        }

        if (options && options.isPublicPath && options.noCors) {
          // init.mode = 'no-cors';
        }

        if (params) {
          url = url.concat('?', serializeParams(params));
          // logger.hit(`[ApiClient]: with params ${url}`);
        }

        if (data) {
          init.body = JSON.stringify(data);
          init.headers[contentTypeHeader] = contentType;
        }

        // for server side, the following is requried.
        if (!isDev()) {
          init.agent = agent;
        }

        // if (method.toLowerCase() === 'get') {
        //   // init.headers['Cache-Control'] = 'no-cache';
        //   // init.headers.Pragma = 'no-cache';
        // }

        logger.info(`[ApiClient]: get ${url}`);
        fetch(url, init)
          .then(checkStatus)
          .then(parseJson)
          .then((response:any) => {
            logger.debug(`[ApiClient]: resolve: ${JSON.stringify(response)}`);
            resolve(response);
          })
          .catch((error:any) => {
            if (error && error.response && error.response.statusText) {
              // logger.debug(`[ApiClient][ERROR]: url ${url}, isServer:'${reactConfigs.SERVER ? 'T' : 'F'}', ${JSON.stringify(error)}`);
              logger.debug(`[ApiClient][ERROR]: url ${url},  Error: ${error.response.statusText}`);
              parseJson(error.response).then((body:any) => {
                reject(body);
              });
            } else if (error && error.message) {
              // logger.debug(`[ApiClient][ERROR]: url ${url}, isServer:'${reactConfigs.SERVER ? 'T' : 'F'}', ${JSON.stringify(error)}`);
              logger.debug(`[ApiClient][ERROR]: url ${url}`);
              reject(error.message);
            } else {
              reject(error);
            }
          });
    });

      // ToDo - research timeouts... set a timeout of all fetch request
      // setTimeout((delay, handleResult) => {
      //   const req = handleResult(params);

      //   return handleResult ? resolve(req) : reject(`Reject Timeout ${ delay }`);
      // }, delay);
  };

  get (path:string, ...args: any ): Promise<any> {
    return this.fetch( EFetchMethods.get, path, ...args );
  }

  post (path:string, ...args: any ): Promise<any> {
    return this.fetch( EFetchMethods.post, path, ...args );
  }

  put (path:string, ...args: any ): Promise<any> {
    return this.fetch( EFetchMethods.put, path, ...args );
  }

  delete (path:string, ...args: any ): Promise<any> {
    return this.fetch( EFetchMethods.delete, path, ...args );
  }
}

// Create a Instance as singleton
const apiClient = new ApiClient(rootUrl);

export default apiClient;
