import { isEmpty, isArray } from '@util/core.util';
import { IWPPost } from '@srcTypes/models';

export class WordpressHelper {
  public static parsePosts(json: Array<any>): Array<IWPPost> {
    const postArray: Array<IWPPost> = [];
    if (!isEmpty(json) && isArray(json) ) {
      json.forEach(element => {
        const postItem:IWPPost = {
          id: element.id,
          slug: element.slug,
          date: element.date,
          type: element.type,
          title: element.title,
          content: element.content,
          excerpt: element.excerpt,
        };
        postArray.push(postItem);
      });
    }

    return postArray;
  }
}
