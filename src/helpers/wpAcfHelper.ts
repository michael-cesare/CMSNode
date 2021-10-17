import { isEmpty, sizeOf } from '@util/core.util'
import { IWPObject, IWPMenu } from '@srcTypes/models'
import { EDomTypes } from '@srcTypes/enums'

interface IWPProperties {
  name: string
  func?: (message: any, collection: IWPSet) => void
  params?: IWPSet
}

interface IWPSet {
  [key: string]: IWPProperties
}

/**
 * Generic helper for all wordpresss ACF attributes objects.
 * ACF in this project are used for different reasons, so use sub ACF wisely.
 * Since ACF can grow alot, it was best to seperate it from the main helpers.
 */
export class WpAcfHelper {
  private styleSet: IWPSet
  private contentPostTypeQuerySet: IWPSet
  private contentPostIdsQuerySet: IWPSet
  private cardSet: IWPSet
  private briefSet: IWPSet
  private briefsContentTitleStyleSet: IWPSet
  private briefsContentTextStyleSet: IWPSet
  private briefsContentStyleSet: IWPSet
  private bgImageHeaderSet: IWPSet
  private bgImageParagraphsSet: IWPSet
  private bgImageConentSet: IWPSet
  private bgImageSet: IWPSet
  private cardsSet: IWPSet
  private acfSet: IWPSet
  private paragraphsTitleSet: IWPSet
  private paragraphSet: IWPSet
  private paragraphsSet: IWPSet
  private postTypeSet: IWPSet
  private briefsSet: IWPSet

  constructor() {
    this.styleSet = {
      background_color: { name: 'backgroundColor' },
      padding: { name: 'padding' },
      color: { name: 'color' },
      font_size: { name: 'fontSize' },
      text_align: { name: 'textAlign' },
      line_height: { name: 'lineHeight' },
    }
    this.contentPostTypeQuerySet = {
      search_count: { name: 'searchCount' },
      post_type: { name: 'postType' },
      post_slug: { name: 'postSlug' },
      sort_order: { name: 'sortOrder' },
      page_size: { name: 'pageSize' },
      page_index: { name: 'pageIndex' },
      term_slugs: { name: 'termSlugs' },
      taxonomy: { name: 'taxonomy' },
    }
    this.contentPostIdsQuerySet = {
      ids: { name: 'ids' },
    }
    this.briefsContentTitleStyleSet = {
      style: { name: 'style', func: this.parseItem, params: this.styleSet },
    }
    this.briefsContentTextStyleSet = {
      style: { name: 'style', func: this.parseItem, params: this.styleSet },
    }
    this.briefsContentStyleSet = {
      title: { name: 'title', func: this.parseItem, params: this.briefsContentTitleStyleSet },
      text: { name: 'text', func: this.parseItem, params: this.briefsContentTextStyleSet },
    }
    this.cardSet = {
      title: { name: 'title' },
      image: { name: 'image' },
      text: { name: 'text' },
      button_link: { name: 'buttonLink' },
      style: { name: 'style', func: this.parseItem, params: this.styleSet },
    }
    this.briefSet = {
      title: { name: 'title' },
      image: { name: 'image' },
      text: { name: 'text' },
      link: { name: 'link' },
    }
    this.bgImageHeaderSet = {
      text: { name: 'text' },
      style: { name: 'style', func: this.parseItem, params: this.styleSet },
    }
    this.bgImageParagraphsSet = {
      text: { name: 'text' },
      style: { name: 'style', func: this.parseItem, params: this.styleSet },
    }
    this.bgImageConentSet = {
      url: { name: 'url' },
      header: { name: 'header', func: this.parseItem, params: this.bgImageHeaderSet },
      paragraphs: { name: 'paragraphs', func: this.parseItem, params: this.bgImageParagraphsSet },
    }
    this.bgImageSet = {
      order: { name: 'order' },
      content: { name: 'content', func: this.parseItem, params: this.bgImageConentSet },
      place_holder: { name: 'placeHolder' },
      type: { name: 'type' },
      content_post_type_query: { name: 'contentPostTypeQuery', func: this.parseItem, params: this.contentPostTypeQuerySet },
      content_post_ids_query: { name: 'contentPostIdsQuery', func: this.parseItem, params: this.contentPostIdsQuerySet },
    }
    this.cardsSet = {
      order: { name: 'order' },
      content: { name: 'content', func: this.parseItem, params: this.cardSet },
      place_holder: { name: 'placeHolder' },
      style: { name: 'style', func: this.parseItem, params: this.styleSet },
      content_post_type_query: { name: 'contentPostTypeQuery', func: this.parseItem, params: this.contentPostTypeQuerySet },
      content_post_ids_query: { name: 'contentPostIdsQuery', func: this.parseItem, params: this.contentPostIdsQuerySet },
    }
    this.paragraphsTitleSet = {
      text: { name: 'text' },
      style: { name: 'style', func: this.parseItem, params: this.styleSet },
    }
    this.paragraphSet = {
      text: { name: 'text' },
      type: { name: 'type' },
      style: { name: 'style', func: this.parseItem, params: this.styleSet },
    }
    this.paragraphsSet = {
      order: { name: 'order' },
      content: { name: 'content', func: this.parseItem, params: this.paragraphSet },
      place_holder: { name: 'placeHolder' },
      title: { name: 'title', func: this.parseItem, params: this.paragraphsTitleSet },
      type: { name: 'type' },
      style: { name: 'style', func: this.parseItem, params: this.styleSet },
      content_post_type_query: { name: 'contentPostTypeQuery', func: this.parseItem, params: this.contentPostTypeQuerySet },
      content_post_ids_query: { name: 'contentPostIdsQuery', func: this.parseItem, params: this.contentPostIdsQuerySet },
    }
    this.briefsSet = {
      order: { name: 'order' },
      content: { name: 'content', func: this.parseItem, params: this.briefSet },
      place_holder: { name: 'placeHolder' },
      title: { name: 'title', func: this.parseItem, params: this.paragraphsTitleSet },
      type: { name: 'type' },
      style: { name: 'style', func: this.parseItem, params: this.styleSet },
      content_style: { name: 'contentStyle', func: this.parseItem, params: this.briefsContentStyleSet },
      content_post_type_query: { name: 'contentPostTypeQuery', func: this.parseItem, params: this.contentPostTypeQuerySet },
      content_post_ids_query: { name: 'contentPostIdsQuery', func: this.parseItem, params: this.contentPostIdsQuerySet },
    }
    this.postTypeSet = {
      data: { name: 'data' },
    }
    // Define sub attribtues to the ACF. use only Name for this
    this.acfSet = {
      // ACF pageTemplates are used to memic React components.
      pageTemplates: { name: 'pageTemplates' },
      // TODO - add settings to the page, this will control overall settings of the page, can also have global variables such as company address, contact, or URLs
      // settings: { name: 'settings' .... },
    }
  }

  /**
   * Decrypts an Object with a set of keys.
   *
   * @param {object} jsonData The Json data to be parsed
   * @param {object} collection The set of keys with its collection and options
   * @returns {object}
   */
  private parseItem = (jsonData: any, collection: IWPSet): Array<IWPObject> | IWPMenu | IWPObject | undefined => {
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
   * @param {object} json - The Json data of pageTemplates to be parsed
   * @returns {object}
   */
  private parseAcfAttribute(json: any): Array<any> {
    let response: Array<any> = []
    json.forEach((data: any) => {
      const acfTempplateType = data.type || EDomTypes.unknown

      let objectSet: IWPSet = {}
      if (!isEmpty(data)) {
        // special type - menu
        if (sizeOf(data) > 0 && acfTempplateType === EDomTypes.cards) {
          objectSet = this.cardsSet
        } else if (sizeOf(data) > 0 && acfTempplateType === EDomTypes.bgImage) {
          objectSet = this.bgImageSet
        } else if (sizeOf(data) > 0 && acfTempplateType === EDomTypes.paragraphs) {
          objectSet = this.paragraphsSet
        } else if (sizeOf(data) > 0 && acfTempplateType === EDomTypes.postType) {
          objectSet = this.postTypeSet
        } else if (sizeOf(data) > 0 && acfTempplateType === EDomTypes.briefs) {
          objectSet = this.briefsSet
        }
        // TODO - add newsFeed to the homepage, use it as latest/top blogs with sammery in it.
        // if (sizeOf(data) > 0 && acfTempplateType === EDomTypes.newsFeed) {

        // TODO - add Thumbnails to the page, similar to cards but it will be just an image with title in the footer. and action link to pages.
        // if (sizeOf(data) > 0 && acfTempplateType === EDomTypes.Thumbnails) {
      }

      if (!isEmpty(objectSet)) {
        response.push(this.parseItem(data, objectSet))
      }
    })

    return response
  }

  /**
   * Parser for Acf sub attributes.
   * Each sub attribute should use objectParser. 
   * @param advanceFields raw json data
   */
  public parseAcf = (advanceFields: any): any => {
    if (!advanceFields || isEmpty(advanceFields)) {
      return advanceFields
    }

    // ACF sub attributes
    const response = Object.assign({}, advanceFields)
    Object.keys(this.acfSet)
      .forEach((key) => {
        const { name } = this.acfSet[key]
        let keyToParse: string = key
        let keyParse: string = name
        const thisObject = advanceFields[keyToParse]

        if (thisObject && !isEmpty(thisObject)) {
          response[keyParse] = this.parseAcfAttribute(thisObject)
        } else {
          response[keyParse] = thisObject
        }

      })

    return response
  }
}
