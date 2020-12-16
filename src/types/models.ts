//  -------------    WordPress Objects    -------------------

export interface IObject {
  type: string,
}

export interface IWPMenu extends IObject {
  type: string,
  menu: Array<IMenuItem>,
  postTypes: Array<string>,
}


export interface IWPObject extends IObject {
  id: number,
  slug: string,
  date: string,
  title: string,
  content: string,
  excerpt: string,
}

export interface IWPPost extends IWPObject {
  modified: string,
  status: string,
  author: number,
  link: string,
  thumbnail: string,
}

export interface IWPPosts extends IObject {
  postCount: number,
  foundPosts: number,
  maxNumPages: number,
  posts: Array<IWPPost>,
}

// 1 page can have multiple posts lists, this is based on ACF page templates.
export interface IWPPage extends IWPObject {
  advanceFields?: IAdvanceField,
  pagePosts?: Array<IWPPosts>,
}

export interface IAdvanceField {
  pageTemplates: Array<IPageTemplate<any>>,
}


//  -------------    Wordpress Request and Response    -------------------

export interface IFetchRequest {
}

export interface IFetchResponse {
  data: Array<IWPObject> | IWPObject | IWPMenu | IWPPosts,
  errors: Array<IError>,
}

export interface IError {
  code: any,
  info: string,
}

export interface IFetchPostsRequest extends IFetchRequest {
  searchCount: number,
  postType: string,
  postSlug: string,
  sortOrder: string,
  pageSize: number,
  pageIndex: number,
  termSlugs: string,
  taxonomy: string,
}

export interface IFetchPostsResponse extends IFetchResponse {
  params: IFetchPostsRequest
  searchCount: number
}


//  -------------    ACF PageTemplates Objects   -------------------

export interface IBgImageHeader {
  text: string,
  style: IStyle,
}

export interface IBgImage {
  url: string,
  header: IBgImageHeader,
  paragraphs: Array<IParagraph>,
}

export interface ICardInfo {
  title: string,
  image: string,
  text: string,
  buttonLink: string,
}

export interface IParagraph {
  text: string,
  style: IStyle,
}

export interface IParagraphsTitle {
  text: string,
  style?: IStyle,
}

//  -------------    ACF PageTemplates    -------------------

/**
 * Every ACF in page_template, must have the listed attibutes as a base object
 * 
 * order                order to sort the component for viewing
 * placeHolder          text in wordpress page content to be replaced by this page template content
 * type                 this is the main type of this acf. type to define sub type of acf. sometimes it's value is the same as placeholder.
 *                      There is also a specific parser for each different type to generate html.
 * content              The base content to be extended by children. fill html in page using its json data.
 * contentPostTypeQuery Custom Post Types query. When provided,
 *                      content attribute is ignored and it will try to fetch posts by its post type and query.
 * style                General Syling for the component, this is optional.
 */
export interface IPageTemplate<T> {
  order: number,
  placeHolder: string,
  type: string,
  content: T,
  contentPostTypeQuery?: IFetchPostsRequest,
  style?: IStyle,
}

export interface IPageTemplateCardInfo extends IPageTemplate<Array<ICardInfo>> {
}

export interface IPageTemplateParagraphs extends IPageTemplate<Array<IParagraph>> {
  title: IParagraphsTitle,
}

export interface IPageTemplateBgImage extends IPageTemplate<IBgImage> {
}


//  -------------    Repositories Interfaces   -------------------

export interface IWpRepo {
  fetchMenu: () => Promise<IFetchResponse>,
  fetchPage: (pageSlug: string) => Promise<IFetchResponse>,
  fetchPost: (slug: string) => Promise<IFetchResponse>,
  fetchPosts: (params: IFetchPostsRequest) => Promise<IFetchResponse>,
}


//  -------------    OTHER  Objects   -------------------

export interface IStyle {
  backgroundColor: string,
  padding: string,
  color: string,
  fontSize: string,
  textAlign?: string | undefined,
}

export interface IMenuItem {
  id: number,
  postParent: number,
  menuOrder: number,
  menuParent: number,
  title: string,
  url: string,
  slug: string,
  route: string,
  menu: Array<IMenuItem>
}
