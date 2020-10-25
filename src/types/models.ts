export interface IObject {
}

export interface IWPMenu extends IObject {
  type: string;
  foundPosts: string;
  postCount: number;
  maxNumPages: number;
  posts: Array<any>;
}

export interface IWPObject extends IObject {
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
  data: Array<IWPObject> | IWPObject | IWPMenu;
  errors: Array<IError>;
}

export interface IError {
  code: any;
  info: string;
}

export interface IFetchPostsRequest extends IFetchRequest {
  searchCount: number;
  postType: string;
  postSlug: string;
  sortOrder: string,
  pageSize: number,
  pageIndex: number,
  termSlugs: string,
  taxonomy: string,
}

export interface IFetchPostsResponse extends IFetchResponse {
  params: IFetchPostsRequest;
  searchCount: number;
}

export interface IWpRepo {
  fetchMenu: () => Promise<IFetchResponse>,
  fetchPage: (pageSlug: string) => Promise<IFetchResponse>,
  fetchPost: (slug: string) => Promise<IFetchResponse>,
  fetchPosts: (params: IFetchPostsRequest) => Promise<IFetchResponse>,
}
