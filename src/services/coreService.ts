import WpRepo from '@repositories/wpRepo'
import wpRepoMock from '@repositories/wpRepoMock'

import { USE_MOCK } from "@config/envConfig"
import {
  IFetchResponse,
  IFetchPostsRequest,
  IFetchPostsListRequest,
  IWpRepo,
  IWPMenu,
  IWPPage,
  IWPPosts,
  IPageTemplate,
  IWPPagePosts,
} from '@srcTypes/models'
import { IPostVM, IPageVM } from '@srcTypes/viewModels'

import logger from '@util/logger.util'
import * as menuUtil from '@util/menu.util'
import { isEmpty, isNullOrUndefined } from '@util/core.util'
import { defaultPostQuery, defaultPostListQuery } from '@util/query.util'

class CoreService {
  wpRepo: IWpRepo

  constructor() {
    this.wpRepo = USE_MOCK() ? new wpRepoMock() : new WpRepo()
  }

  fetchMenu = async (): Promise<IFetchResponse> => {
    logger.hit('[fetchMenu]')

    return await this.wpRepo.fetchMenu()
  }

  /**
   * Fetch a single page, and fetch posts if it has posts query in the ACF templates.
   * A page may have multiple post types listing, and might not have any.
   * @param pageSlug page name
   */
  fetchPage = async (pageSlug: string): Promise<IPageVM> => {
    logger.hit(`[fetchPage]: pageSlug ${pageSlug}`)

    let message = {} as IPageVM
    const fetchMenuResult = await this.wpRepo.fetchMenu()
    const fetchPageResult = await this.wpRepo.fetchPage(pageSlug)

    const menu = fetchMenuResult.data as IWPMenu
    const wpPage = fetchPageResult.data as IWPPage

    // A page can have multiple posts in it, fetch them all
    if (menu && wpPage.advanceFields) {
      const { advanceFields: { pageTemplates } } = wpPage
      wpPage.pagePosts = await this.fetchPagePosts(menu, pageTemplates)
      fetchPageResult.data = wpPage
    }

    message.menu = fetchMenuResult
    message.page = fetchPageResult

    return message
  }

  /**
   * First it graps the menu, then checks if the post type given exists.. if not return empty object.
   * For single; Fetch detailed page, and it details post using slug name.
   * For Listing; Fetch listing page, and all post for the given post type.
   * Note: that Page is Optional, but post is required.
   * @param isSingle detailed page or listing page
   * @param params request parameters
   */
  fetchPostsPage = async (isList: boolean, params: IFetchPostsRequest): Promise<IPostVM> => {
    const type = isList ? 'listing' : 'detail'
    const { postType } = params
    const postTypePageSlug = `${postType}-${type}`
    logger.hit(`[fetchPosts][${postTypePageSlug}]`)

    let message = {} as IPostVM
    const fetchMenuResult = await this.wpRepo.fetchMenu()
    const menu = fetchMenuResult.data as IWPMenu
    const menuHasPostType = menuUtil.findPostType(menu, postType)

    if (menuHasPostType && !isEmpty(menuHasPostType) && !isNullOrUndefined(menuHasPostType)) {
      // page is optional for post types,
      // however it allows to add settings and content to listing and details
      const fetchPageResult = await this.wpRepo.fetchPage(postTypePageSlug)

      message.menu = fetchMenuResult
      message.page = fetchPageResult

      // for single fill post, and for listing fill posts
      if (isList) {
        const fetchPostsResult = await this.wpRepo.fetchPosts(params)
        message.posts = fetchPostsResult
      } else {
        const fetchPostResult = await this.wpRepo.fetchPost(params.postSlug)
        message.post = fetchPostResult
      }
    }

    return await Promise.resolve(message)
  }

  /**
   * Uses ACF page Advance field to query every post type in list.
   * @param menu full menu and routing
   * @param acfTemplates page Templates Advance Field
   */
  private fetchPagePosts = async (menu: IWPMenu, acfTemplates: Array<IPageTemplate<any>>): Promise<IWPPosts[]> => {
    let pagePosts: Array<IWPPagePosts> = []
    for (let index = 0; index < acfTemplates.length; index++) {
      const { contentPostTypeQuery, contentPostIdsQuery } = acfTemplates[index]

      if (contentPostTypeQuery && !isEmpty(contentPostTypeQuery)) {
        const menuHasPostType = menuUtil.findPostType(menu, contentPostTypeQuery.postType)
        if (menuHasPostType && !isEmpty(menuHasPostType) && !isNullOrUndefined(menuHasPostType)) {
          const postsParams: IFetchPostsRequest = Object.assign(defaultPostQuery(), contentPostTypeQuery)
          const fetchPostsResult = await this.wpRepo.fetchPosts(postsParams)
          const pagePostsEntry = fetchPostsResult.data as IWPPagePosts
          pagePostsEntry.mappedIndex = index
          pagePosts.push(pagePostsEntry)
        }
      }

      if (contentPostIdsQuery && !isEmpty(contentPostIdsQuery)) {
        const postsParams: IFetchPostsListRequest = Object.assign(defaultPostListQuery(), contentPostIdsQuery)
        const fetchPostsResult = await this.wpRepo.fetchPostsList(postsParams)
        const pagePostsEntry = fetchPostsResult.data as IWPPagePosts
        pagePostsEntry.mappedIndex = index
        pagePosts.push(pagePostsEntry)
      }
    }

    return await Promise.resolve(pagePosts)
  }
}

// Create a Home Instance as singleton
const coreService = new CoreService()

export default coreService
