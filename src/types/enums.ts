export enum EWordpressEndpoints {
  menuEndpoint = 'wp/menu-navigation',
  postsEndpoint = 'wp/posts',
  postEndpoint = 'wp/post',
  pagesEndpoint = 'wp/pages',
}

export enum EWordpressFiles {
  menu = '/mock/menu.json',
  posts = '/mock/posts.json',
  post = '/mock/post.json',
  page = '/mock/page.json',
}

export enum EENV {
  dev = 'development',
  prod ='production',
}

export enum EWPTypes {
  menu = 'menu',
  post = 'post',
  posts = 'posts',
  page = 'page',
  unknown = 'unknown',
}
