export enum EWordpressEndpoints {
  menuEndpoint = 'wp/menu-navigation',
  postsEndpoint = 'wp/posts',
  postEndpoint = 'wp/post',
  pagesEndpoint = 'wp/pages',
  postsListEndpoint = 'wp/postsById',
}

export enum EWordpressFiles {
  menu = '/mock/menu.json',
  posts = '/mock/{{posts}}.json',
  post = '/mock/{{post}}.json',
  page = '/mock/{{page}}.json',
  postsList = '/mock/{{posts}}.json',
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
  postsBriefs = 'posts-briefs',
  careersCards = 'careers-cards',
  unknown = 'unknown',
}

 /**
 * Dom types are for dynamic generated dom elements.
 * Some of the types are from wordpress acf types
 *
 * cards      Array of cardInfo. Container for card info list.
 * cardInfo   Image at the top, and title, text with link in the bottom. text can be left empty.
 * bgImage    A full background sized imeage with some text and link in it
 * paragraphs Array of title-text, Basic headers and texts for each paragraph given.
 * string     Plain text
 * unknown    NA
 * postType   Uses Post type data
 * briefs     Briefs offers flexibility on styling. It is a contianer for an array of brief.
 *            Image are put in as background, and the title with link on top of it.
 *            Briefs can also support for title only, without providing text brief summery.
 */
export enum EDomTypes {
  cards = 'cards',
  cardInfo = 'card-info',
  bgImage = 'bg-image',
  paragraphs = 'paragraphs',
  string = 'string',
  unknown = 'unknown',
  postType = 'postType',
  briefs = 'briefs',
}
