import { EENV } from '@srcTypes/enums';

import { EnvConfig } from "@config/envConfig";

/**
 * Replaced the keys of a url with it's correct values
 * @param url {string} - URL to change
 * @param paramsObj {any} - Object with keys to replace
 */
export const formatUrl = ( url: string, paramsObj: any ): string => {
  return Object
    .keys( paramsObj )
    .reduce( ( newUrl, key ) =>
      newUrl.replace( `{${ key }}`, paramsObj[key] ), url );
}

/**
 * Validates if the app is being loaded with an IP address
 * @return {boolean}
 */
export const isIpAddress = ( hostname:string ): boolean => {
  return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test( hostname );
}

export const isLocal = ( hostname:string ): boolean => {
  return hostname === 'localhost' || isIpAddress(hostname);
}

export const isDev = (): boolean => {
  return EnvConfig.env === EENV.dev;
}

export const isProduction = (): boolean => {
  return EnvConfig.env === EENV.prod;
}
