export enum EWordpressEndpoints {
  menuEndpoint = 'wp/menu-navigation',
  postsEndpoint = 'wp/posts',
  postEndpoint = 'wp/post',
  pagesEndpoint = 'wp/pages',
}

export enum EWordpressFiles {
  menu = '/mock/menu.json',
  posts = '/mock/{{posts}}.json',
  post = '/mock/{{post}}.json',
  page = '/mock/{{page}}.json',
}

export enum EENV {
  dev = 'development',
  prod ='production',
}

/**
 * Wordpress Object types
 */
export enum EWPTypes {
  menu = 'menu',
  post = 'post',
  posts = 'posts',
  career = 'career',
  careers = 'careers',
  page = 'page',
  unknown = 'unknown',
}

/**
 * Errors and codes
 */
export enum EErrorsCodes {
  SomethingWentWrong = '900',
  FailedFetch = '901',
  FileNotFound = '902',
}

/**
 * A list of wordpress placeholders.
 * wordpress page content has placeholders,which are replaced by ACF placeholders content.
 */
export enum EWPAcfPlaceHolders {
  cards = 'cards',
  bgImage = 'bg-image',
  paragraphs = 'paragraphs',
  unknown = 'unknown',
}

/**
 * Dom types are for dynamic generated dom elements.
 * Some of the types are from wordpress acf types
 */
export enum EDomTypes {
  cards = 'cards',
  cardInfo = 'card-info',
  bgImage = 'bg-image',
  paragraphs = 'paragraphs',
  string = 'string',
  unknown = 'unknown',
  postType = 'postType',
}
