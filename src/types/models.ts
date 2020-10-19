export interface IWPObject {
  id: number;
  slug: number;
  date: string;
  type: string;
  title: string;
  content: string;
  excerpt: string;
}

export interface IWPPost extends IWPObject {
}

export interface IWPPage extends IWPObject {
}

export interface IFetchRequest {
}

export interface IFetchResponse {
  data?: any;
  errors?: Array<IError>;
}

export interface IError {
  code?: any;
  info: string;
}

export interface IFetchPostsRequest extends IFetchRequest {
  searchCount?: number;
  postType?: string;
  postSlug?: string;
  sortOrder?: string,
  pageSize?: number,
  pageIndex?: number,
  termSlugs?: string,
  taxonomy?: string,
}

export interface IFetchPostsResponse extends IFetchResponse {
  params?: IFetchPostsRequest;
  searchCount?: number;
}

export interface IWpRepo {
  fetchMenu: () => Promise<any>,
  fetchPage: (pageSlug:string) => Promise<any>,
  fetchPost: (slug:string) => Promise<any>,
  fetchPosts: (params:IFetchPostsRequest) => Promise<IFetchPostsResponse>,
}
