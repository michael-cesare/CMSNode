import { isEmpty, isArray, sizeOf } from '@util/core.util'
import { IWPObject, IWPMenu } from '@srcTypes/models'
import { EWPTypes } from '@srcTypes/enums'
import { WpAcfHelper } from './wpAcfHelper'

interface IWPProperties {
  name: string
  func?: (message: any, collection: IWPSet) => void
  params?: IWPSet
}

interface IWPSet {
  [key: string]: IWPProperties
}

/**
 * Generic helper for all wordpresss objects
 */
export class WordpressHelper {
  private valueSet: IWPSet
  private acfSet: IWPSet
  private wordpressSet: IWPSet
  private menuSet: IWPSet
  private postSet: IWPSet
  private pageSet: IWPSet
  private postsSet: IWPSet
  private menuItemSet: IWPSet

  constructor() {
    this.valueSet = { type: { name: 'Value' } }
    this.acfSet = {
      page_templates: { name: 'pageTemplates' },
    }
    this.postSet = {
      ID: { name: 'id' },
      slug: { name: 'slug' },
      date: { name: 'date' },
      type: { name: 'type' },
      link: { name: 'link' },
      post_title: { name: 'title' },
      post_content: { name: 'content' },
      excerpt: { name: 'excerpt' },
      thumbnail: { name: 'thumbnail' },
    }
    this.postsSet = {
      post_count: { name: 'postCount' },
      found_posts: { name: 'foundPosts' },
      max_num_pages: { name: 'maxNumPages' },
      posts: { name: 'posts', func: this.parseItem, params: this.postSet },
    }
    this.pageSet = {
      id: { name: 'id' },
      slug: { name: 'slug' },
      date: { name: 'date' },
      type: { name: 'type' },
      title: { name: 'title' },
      content: { name: 'content' },
      excerpt: { name: 'excerpt' },
      acf: { name: 'advanceFields', func: this.parseAcf, params: this.acfSet },
      // pagePosts: { name: 'pagePosts', func: this.parseItem, params: this.postSet },
    }
    this.menuItemSet = {
      ID: { name: 'id' },
      post_parent: { name: 'postParent' },
      menu_order: { name: 'order' },
      menu_parent: { name: 'menuParent' },
      title: { name: 'title' },
      url: { name: 'url' },
      slug: { name: 'slug' },
      route: { name: 'route' },
      // @ts-ignore: this.menuItemSet is really assigned before being used as it is recursive
      menu: { name: 'menu', func: this.parseItem, params: this.menuItemSet },
    }
    this.menuSet = {
      type: { name: 'type' },
      menu: { name: 'menu', func: this.parseItem, params: this.menuItemSet },
    }
    this.wordpressSet = {
      type: { name: 'type', func: this.parseItem, params: this.valueSet },
      menu: { name: 'menu', func: this.parseItem, params: this.menuSet },
      post: { name: 'post', func: this.parseItem, params: this.postSet },
      page: { name: 'page', func: this.parseItem, params: this.pageSet },
      posts: { name: 'posts', func: this.parseItem, params: this.postsSet },
    }
  }

  /**
   * Parser for Acf and all sub attributes.
   * Each sub attribute should use another helper as consistency. 
   * @param jsonData raw json data
   * @param collection collected defiend by the Set
   */
  private parseAcf = (jsonData: any, collection: IWPSet): any => {
    if (!jsonData) {
      return jsonData
    }

    // acfSet must be left with name only, then parse the sub attribute in the helper below
    const advanceFields = this.parseItem(jsonData, collection)
    // pageTemplates sub attribute helper
    const advanceFieldsParsed = new WpAcfHelper().parseAcf(advanceFields)

    return advanceFieldsParsed
  }

  /**
   * Decrypts an Object with a set of keys.
   *
   * @param {object} jsonData The Json data to be parsed
   * @param {object} collection The set of keys with its collection and options
   * @returns {object}
   */
  private parseItem = (jsonData: any, collection: IWPSet): any => {
    if (!jsonData) {
      return jsonData
    }

    const response = Object.assign({}, jsonData)
    Object.keys(collection)
      .forEach((key) => {
        const { name, params, func }: IWPProperties = collection[key]
        let keyToParse: string = key
        let keyParse: string = name

        const thisObject = jsonData[keyToParse]

        if (jsonData[keyToParse] !== undefined) {
          delete response[keyToParse]
          if (params && func) {
            if (thisObject instanceof Array) {
              response[keyParse] = thisObject.map((item) => func(item, params))
            } else {
              response[keyParse] = func(thisObject, params)
            }
          } else {
            response[keyParse] = thisObject
          }
        }
      })

    return response
  }

  /**
   * Decrypts an Object being passed on
   * @param {object} json - The Json data to be parsed
   * @returns {object}
   */
  public objectParser(json: any): Array<IWPObject> | IWPMenu | IWPObject | undefined {
    const wpType = json.type || EWPTypes.unknown
    let objectSet: IWPSet = this.wordpressSet

    if (!isEmpty(json)) {
      // special type - menu
      if (sizeOf(json) > 0 && wpType === EWPTypes.menu) {
        objectSet = this.menuSet
      } else if (sizeOf(json) > 0 && wpType === EWPTypes.page) {
        objectSet = this.pageSet
      } else if (sizeOf(json) > 0 && wpType === EWPTypes.post) {
        objectSet = this.postSet
      } else if (sizeOf(json) > 0 && (
        wpType === EWPTypes.careers
        || wpType === EWPTypes.posts
      ) ) {
        objectSet = this.postsSet
      } else if (isArray(json)) {
        // generic fallback type for wp default posts..
        objectSet = this.postsSet
      } else if (sizeOf(json) > 0) {
        // generic fallback type for wp default single page/post..
        objectSet = this.postSet
      }
    }

    return this.parseItem(json, objectSet)
  }

}
