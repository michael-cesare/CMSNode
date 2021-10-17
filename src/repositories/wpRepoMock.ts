import { EWordpressFiles } from '@srcTypes/enums'
import {
  IFetchPostsRequest,
  IFetchPostsListRequest,
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
const fetchPostsListEndpoint = EWordpressFiles.postsList

class WpRepoMock implements IWpRepo {

  fetchMenu = async (): Promise<IFetchResponse> => {
    const fetchUrl = pathResolve(fetchMenuEndpoint)
    return await this.readMockfile(fetchUrl)
  }

  fetchPage = async (pageSlug: string): Promise<IFetchResponse> => {
    const fetchPageEndpointSlug = fetchPageEndpoint.replace(`{{page}}`, pageSlug)
    const fetchUrl = pathResolve(fetchPageEndpointSlug)
    return await this.readMockfile(fetchUrl)
  }

  fetchPost = async (slug: string): Promise<IFetchResponse> => {
    const fetchPostEndpointSlug = fetchPostEndpoint.replace(`{{post}}`, slug)
    const fetchUrl = pathResolve(fetchPostEndpointSlug)
    return await this.readMockfile(fetchUrl)
  }

  fetchPosts = async (params: IFetchPostsRequest): Promise<IFetchResponse> => {
    const fetchPostEndpointSlug = fetchPostsEndpoint.replace(`{{posts}}`, params.postType)
    const fetchUrl = pathResolve(fetchPostEndpointSlug)
    return await this.readMockfile(fetchUrl)
  }

  fetchPostsList = async (fetchPostsListRequest: IFetchPostsListRequest): Promise<IFetchResponse> => {
    // Mock by using posts.json as the actual request is get by ids
    const fetchPostEndpointSlug = fetchPostsListEndpoint.replace(`{{posts}}`, 'careers')
    const fetchUrl = pathResolve(fetchPostEndpointSlug)
    return await this.readMockfile(fetchUrl)
  }

  readMockfile = async (fetchUrl: string): Promise<any> => {
    const fetchPostsResponse: IFetchResponse = {
      data: [],
      errors: [],
    }

    const parseWP = (json: any) => {
      logger.info(`[readMockfile][parseWP] url ${fetchUrl}`)
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

      return fetchPostsResponse
    }

    const errorCatcher = (err: any) => {
      logger.log(`[readMockfile][errorCatcher] ${JSON.stringify(err)}`)
      if (err) {
        const errorQueue: IError = {
          code: this.readErrorCode(err.code),
          info: err.errno,
        }
        fetchPostsResponse.errors.push(errorQueue)
        throw new Error(errorQueue.code)
      }
    }

    return await readfile(fetchUrl)
      .then(parseWP)
      .catch(errorCatcher)
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
