import {
  IFetchPostsRequest,
  IFetchPostsListRequest,
} from '@srcTypes/models'

const postQuery = {
  postType: 'post',
  postSlug: '',
  searchCount: 0,
  sortOrder: '',
  pageSize: 5,
  pageIndex: 0,
  termSlugs: '',
  taxonomy: '',
}

const postListQuery = {
  searchPostIds: [],
}

/**
 * Builds Up the default minimun requirements for post query
 * @return {IFetchPostsRequest} - Object with key values
 */
export const defaultPostQuery = (): IFetchPostsRequest => {
  return Object.assign({}, postQuery)
}

/**
 * Builds Up the default minimun requirements for post query
 * @return {IFetchPostsRequest} - Object with key values
 */
export const defaultPostListQuery = (): IFetchPostsListRequest => {
  return Object.assign({}, postListQuery)
}
