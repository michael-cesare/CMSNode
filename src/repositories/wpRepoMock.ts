import { EWordpressFiles } from '@srcTypes/enums'
import {
  IFetchPostsRequest,
  IFetchPostsResponse,
  IWPObject,
  IFetchResponse,
  IWpRepo,
  IWPMenu,
  IError,
} from '@srcTypes/models'
import { EWPTypes, EErrorsCodes } from '@srcTypes/enums'

import logger from '@util/logger.util'
import { isEmpty, isArray, sizeOf } from '@util/core.util'
import { pathResolve } from '@util/path.util'
import { readfile } from '@util/fs.util'

import { WordpressHelper } from '@helpers/wordpressHelper'

const fetchMenuEndpoint = EWordpressFiles.menu
const fetchPageEndpoint = EWordpressFiles.page
const fetchPostEndpoint = EWordpressFiles.post
const fetchPostsEndpoint = EWordpressFiles.posts

class WpRepoMock implements IWpRepo {

  fetchMenu = async (): Promise<IFetchResponse> => {
    const fetchUrl = pathResolve(fetchMenuEndpoint)
    const action = async () => await new Promise<IFetchResponse>((resolve: any) =>
      this.readMockfile(fetchUrl, resolve, resolve)
    )

    return await action()
  }

  fetchPage = async (pageSlug: string): Promise<IFetchResponse> => {
    const fetchPageEndpointSlug = fetchPageEndpoint.replace(`{{page}}`, pageSlug)
    const fetchUrl = pathResolve(fetchPageEndpointSlug)
    const action = async () => await new Promise<IFetchResponse>((resolve: any) =>
      this.readMockfile(fetchUrl, resolve, resolve)
    )

    return await action()
  }

  fetchPost = async (slug: string): Promise<IFetchResponse> => {
    const fetchPostEndpointSlug = fetchPostEndpoint.replace(`{{post}}`, slug)
    const fetchUrl = pathResolve(fetchPostEndpointSlug)
    const action = async () => await new Promise<IFetchResponse>((resolve: any) =>
      this.readMockfile(fetchUrl, resolve, resolve)
    )

    return await action()
  }

  fetchPosts = async (params: IFetchPostsRequest): Promise<IFetchResponse> => {
    const fetchPostEndpointSlug = fetchPostsEndpoint.replace(`{{posts}}`, params.postType)
    const fetchUrl = pathResolve(fetchPostEndpointSlug)
    const action = async () => await new Promise<IFetchPostsResponse>((resolve: any) =>
      this.readMockfile(fetchUrl, resolve, resolve)
    )

    return await action()
  }

  readMockfile = async (fetchUrl: string, onSuccess: any, onError: any): Promise<void> => {
    const fetchPostsResponse: IFetchResponse = {
      data: [],
      errors: [],
    }

    const parseWP = (json: any) => {
      const wpParsed = new WordpressHelper().objectParser(json)
      const type = json.type || EWPTypes.unknown
      if (type === EWPTypes.menu) {
        fetchPostsResponse.data = wpParsed as IWPMenu
      } else if (type === EWPTypes.page) {
        fetchPostsResponse.data = wpParsed as IWPObject
      } else if (type === EWPTypes.post) {
        fetchPostsResponse.data = wpParsed as IWPObject
      } else if (type === EWPTypes.posts) {
        fetchPostsResponse.data = wpParsed as Array<IWPObject>
      } else if (!isEmpty(json) && isArray(json)) {
        fetchPostsResponse.data = wpParsed as Array<IWPObject>
      } else if (!isEmpty(json) && sizeOf(json) > 0) {
        fetchPostsResponse.data = wpParsed as IWPObject
      }

      onSuccess(fetchPostsResponse)
    }

    const errorCatcher = (err: any) => {
      logger.log(`[readMockfile][errorCatcher] ${JSON.stringify(err)}`)
      if (err) {
        const errorQueue: IError = {
          code: this.readErrorCode(err.code),
          info: err.errno,
        }
        fetchPostsResponse.errors.push(errorQueue)
        onError(fetchPostsResponse)
      }
    }

    await readfile(fetchUrl, parseWP, errorCatcher)
  }

  private readErrorCode = (err: string): string => {
    let errorMap = err
    if (err === 'ENOENT') {
      errorMap = EErrorsCodes.FileNotFound
    }

    return errorMap
  }
}

export default WpRepoMock
