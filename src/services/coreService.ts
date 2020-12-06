import WpRepo from '@repositories/wpRepo';
import wpRepoMock from '@repositories/wpRepoMock';

import { USE_MOCK } from "@config/envConfig";
import { IFetchResponse, IFetchPostsRequest, IWpRepo, IWPMenu } from '@srcTypes/models';
import { IPostVM, IPageVM } from '@srcTypes/viewModels';

import logger from '@util/logger.util';
import * as menuUtil from '@util/menu.util';

class CoreService {
  wpRepo: IWpRepo;

  constructor() {
    this.wpRepo = USE_MOCK() ? new wpRepoMock() : new WpRepo();
  }

  fetchMenu = async (): Promise<IFetchResponse> => {
    logger.hit('[fetchMenu]');

    return await this.wpRepo.fetchMenu();
  };

  fetchPage = async (pageSlug:string): Promise<IPageVM> => {
    logger.hit(`[fetchPage]: pageSlug ${pageSlug}`);

    let message = {} as IPageVM;
    const fetchMenuResult = await this.wpRepo.fetchMenu();
    const fetchPageResult = await this.wpRepo.fetchPage(pageSlug);
    message.menu = fetchMenuResult;
    message.page = fetchPageResult;

    // TODO - fetchPosts for last 5 to show..example in homepage show stories using posts... show in cards/slider
    //        maybe check ACF to search for posttypes using loop for eahc post type in page, and search each 1.
    //        Also the Parser needs to update for using this, together with frontend loop.
    //        Example:
    //
    // for (let index = 0; index < postTypes.length; index++) {
    //   const postsParams: IFetchPostsRequest = {
    //     postType: fetchPageResult.acf.pagePosts[index].postType,
    //     postSlug: '',
    //     searchCount: 0,
    //     sortOrder: '',
    //     pageSize: fetchPageResult.acf.pagePosts[index].pageSize,
    //     pageIndex: 0,
    //     termSlugs: '',
    //     taxonomy: '',
    //   };
    //   const fetchPostsResult = await this.wpRepo.fetchPosts(postsParams);
    //   message.page.posts[index] = fetchPostsResult;
    // }

    return message;
  };

  /**
   * First it graps the menu, then checks if the post type given exists.. if not return empty object.
   * For single Fetch detailed page, and it details post using slug name.
   * For Listing, Fetch listing page, and all post for the given post type.
   * Note that Page is Optional, but post type must exists.
   * @param isSingle detailed page or listing page
   * @param params request parameters
   */
  fetchPostsPage = async (isList:boolean, params:IFetchPostsRequest): Promise<IPostVM> => {
    const type = isList ? 'listing' : 'detail';
    const { postType } = params;
    const postTypePageSlug = `${postType}-${type}`;
    logger.hit(`[fetchPosts][${postTypePageSlug}]`);
  
    let message = {} as IPostVM;
    const fetchMenuResult = await this.wpRepo.fetchMenu();
    const menu = fetchMenuResult.data as IWPMenu;
    const menuHasPostType = menuUtil.findPostType(menu, postType);
    logger.hit(`[fetchPosts][${postTypePageSlug}] ${menuHasPostType}`);

    if (menuHasPostType) {
      // page is optional for post types,
      // however it allows to add settings and content to listing and details
      const fetchPageResult = await this.wpRepo.fetchPage(postTypePageSlug);

      message.menu = fetchMenuResult;
      message.page = fetchPageResult;

      // for single fill post, and for listing fill posts
      if (isList) {
        const fetchPostsResult = await this.wpRepo.fetchPosts(params);
        message.posts = fetchPostsResult;
      } else {
        const fetchPostResult = await this.wpRepo.fetchPost(params.postSlug);
        message.post = fetchPostResult;
      }
    }
  
    return message;
  };
}

// Create a Home Instance as singleton
const coreService = new CoreService();

export default coreService;
