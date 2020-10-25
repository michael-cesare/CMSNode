import WpRepo from '@repositories/wpRepo';
import wpRepoMock from '@repositories/wpRepoMock';

import { USE_MOCK } from "@config/envConfig";
import logger from '@util/logger.util';
import { IFetchResponse, IFetchPostsRequest, IWpRepo } from '@srcTypes/models';
import { IPostVM, IPageVM } from '@srcTypes/viewModels';

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

    return message;
  };

  fetchPosts = async (isSingle:boolean, params:IFetchPostsRequest): Promise<IPostVM> => {
    logger.hit('[fetchPosts]');
  
    let message = {} as IPostVM;
    const fetchMenuResult = await this.wpRepo.fetchMenu();
    message.menu = fetchMenuResult;

    if (isSingle) {
      const fetchPostResult = await this.wpRepo.fetchPost(params.postSlug);
      message.post = fetchPostResult;
    } else {
      const fetchPostsResult = await this.wpRepo.fetchPosts(params);
      message.posts = fetchPostsResult;
    }
  
    return message;
  };

}

// Create a Home Instance as singleton
const coreService = new CoreService();

export default coreService;
