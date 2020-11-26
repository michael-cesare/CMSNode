import { isEmpty, sizeOf } from '@util/core.util';
import { IWPObject, IWPMenu } from '@srcTypes/models';
import { EWPAcfTemplateTypes } from '@srcTypes/enums';

interface IWPProperties {
  name: string;
  func?: (message: any, collection: IWPSet) => void;
  params?: IWPSet;
}

interface IWPSet {
  [key: string]: IWPProperties;
}

/**
 * Generic helper for all wordpresss ACF attributes objects
 */
export class WpAcfHelper {
  private cardSet: IWPSet;
  private bgImageSet: IWPSet;
  private cardsSet: IWPSet;
  private acfSet: IWPSet;

  constructor() {
    this.cardSet = {
      title: { name: 'title' },
      image: { name: 'image' },
      text: { name: 'text' },
      button_link: { name: 'buttonLink' },
    };
    this.bgImageSet = {
      order: { name: 'order' },
      content: { name: 'content' },
      place_holder: { name: 'placeHolder' },
      type: { name: 'type' },
    };
    this.cardsSet = {
      order: { name: 'order' },
      content: { name: 'content', func: this.parseItem, params: this.cardSet },
      place_holder: { name: 'placeHolder' },
      type: { name: 'type' },
    };
    // Define sub attribtues to the ACF. use only Name for this
    this.acfSet = {
      pageTemplates: { name: 'pageTemplates' },
    };
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
      return jsonData;
    }

    const response = Object.assign({}, jsonData);
    Object.keys(collection)
      .forEach((key) => {
        const { name, params, func }: IWPProperties = collection[key];
        let keyToParse: string = key;
        let keyParse: string = name;

        const thisObject = jsonData[keyToParse];

        if (jsonData[keyToParse] !== undefined) {
          delete response[keyToParse];
          if (params && func) {
            if (thisObject instanceof Array) {
              response[keyParse] = thisObject.map((item) => func(item, params));
            } else {
              response[keyParse] = func(thisObject, params);
            }
          } else {
            response[keyParse] = thisObject;
          }
        }
      });

    return response;
  };

  /**
   * Decrypts an Object being passed on
   * @param {object} json - The Json data of pageTemplates to be parsed
   * @returns {object}
   */
  private parseAcfAttribute(json: any): Array<any> {
    let response: Array<any> = [];
    json.forEach((data: any) => {
      const acfTempplateType = data.type || EWPAcfTemplateTypes.unknown;

      let objectSet: IWPSet = {};
      if (!isEmpty(data)) {
        // special type - menu
        if (sizeOf(data) > 0 && acfTempplateType === EWPAcfTemplateTypes.cards) {
          objectSet = this.cardsSet;
        } else if (sizeOf(data) > 0 && acfTempplateType === EWPAcfTemplateTypes.bgImage) {
          objectSet = this.bgImageSet;
        }
      }

      if (!isEmpty(objectSet)) {
        response.push(this.parseItem(data, objectSet));
      }
    })

    return response;
  }

  /**
   * Parser for Acf sub attributes.
   * Each sub attribute should use objectParser. 
   * @param advanceFields raw json data
   */
  public parseAcf = (advanceFields: any): any => {
    if (!advanceFields || isEmpty(advanceFields)) {
      return advanceFields;
    }

    // ACF sub attributes
    const response = Object.assign({}, advanceFields);
    Object.keys(this.acfSet)
    .forEach((key) => {
      const { name } = this.acfSet[key];
      let keyToParse: string = key;
      let keyParse: string = name;
      const thisObject = advanceFields[keyToParse];

      if (thisObject && !isEmpty(thisObject)) {
        response[keyParse] = this.parseAcfAttribute(thisObject);
      } else {
        response[keyParse] = thisObject;
      }

    });

    return response;
  }
}
