//  -------------    WordPress Objects    -------------------

export interface IObject {
}

export interface IWPMenu extends IObject {
  type: string;
  menu: Array<IMenuItem>;
  postTypes: Array<string>;
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
  link: string;
  thumbnail: string;
}

export interface IWPPage extends IWPObject {
  advanceFields?: IAdvanceField;
}

export interface IAdvanceField {
  pageTemplates: Array<IPageTemplate>,
}


//  -------------    Wordpress Request and Response    -------------------

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


//  -------------    ACF PageTemplates Objects   -------------------

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
 * order       order to sort the component for viewing
 * placeHolder text in wordpress page content to be replaced by this page template content
 * type        type to define sub type of acf. sometimes it's value is the same as placeholder.
 *             There is also a specific parser for each different type to generate html.
 * style       General Syling for the component, this is optional.
 */
export interface IPageTemplate {
  order: number,
  placeHolder: string,
  type: string,
  style?: IStyle,
}

export interface IPageTemplateCardInfo extends IPageTemplate {
  content: Array<ICardInfo>,
}

export interface IPageTemplateParagraphs extends IPageTemplate {
  content: Array<IParagraph>,
  title: IParagraphsTitle,
}

export interface IPageTemplateBgImage extends IPageTemplate {
  content: string,
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
  menu: Array<IMenuItem>;
}
