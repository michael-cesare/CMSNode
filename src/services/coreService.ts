import WpRepo from '@repositories/wpRepo';
import wpRepoMock from '@repositories/wpRepoMock';

import { EnvConfig } from "@config/envConfig";
import logger from '@util/logger.util';
import { IFetchResponse, IFetchPostsResponse, IFetchPostsRequest, IWpRepo } from '@srcTypes/models';
import { isEmpty } from '@util/core.util';

class CoreService {
  wpRepo: IWpRepo;

  constructor() {
    this.wpRepo = EnvConfig.useMock ? new wpRepoMock() : new WpRepo();
  }

  fetchMenu = async (): Promise<IFetchResponse> => {
    logger.hit('[fetchMenu]');

    return this.wpRepo.fetchMenu();
  };

  fetchPage = async (pageSlug:string): Promise<IFetchResponse> => {
    logger.hit(`[fetchPageAsync]: pageSlug ${pageSlug}`);

    const wpPage = await this.wpRepo.fetchPage(pageSlug);

    return wpPage && wpPage.data ? wpPage.data[0] : wpPage;
  };

  fetchPost = async (slug:string): Promise<IFetchResponse> => {
    logger.hit(`[fetchPostAsync]: pageSlug ${slug}`);

    const wpPost = await this.wpRepo.fetchPost(slug);

    return wpPost && wpPost.data ? wpPost.data[0] : wpPost;
  };

  fetchPosts = async (params:IFetchPostsRequest): Promise<IFetchPostsResponse> => {
    logger.hit('[fetchPostsByCategoryAsync]');
    let result:Promise<IFetchPostsResponse>;

    const posts = await this.wpRepo.fetchPosts(params);
    if (isEmpty(posts.errors)) {
      result = Promise.resolve(posts);
    } else {
      result = Promise.reject(posts);
    }

    return result;
  };

}

// Create a Home Instance as singleton
const coreService = new CoreService();

export default coreService;
