const isEmpty = (val:any) => (!!((typeof val === 'undefined' || val === undefined || val == null || val === 'undefined' || val === '')));

const isNullOrUndefined = (val:any) => (!!((typeof val === 'undefined' || val === undefined || val == null || val === 'undefined')));

const isArray = (val:any) => Array.isArray( val );

const isNodejs = () => {
  const processDefined = typeof process !== 'undefined' && process && process.versions && process.versions.node;
  // const windowDefined = typeof window === 'undefined' || window !== undefined || window !== null;

  // return !windowDefined && processDefined;
  return  processDefined;
};

const isReactBrowser = () => {
  const processDefined = typeof process !== 'undefined' && process && process.versions && process.versions.node;
  // const windowDefined = typeof window === 'undefined' || window !== undefined || window !== null;

  // return !windowDefined && !processDefined;
  return !processDefined;
};

const pad = (text:any, length:any, padChar = '0', inverse = false) => {
  let value = `${text}`;
  while (value.length < length) {
    if (inverse) {
      value = `${value}${padChar}`;
    } else {
      value = `${padChar}${value}`;
    }
  }

  return value;
};

const countProperties = (obj:any) => {
  let count = 0;

  for (const property in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, property)) {
      count++;
    }
  }

  return count;
};

/**
 * get the size of a JS object, or immutable keys/values/entries.
 * method is able to get keySeq size of immutable
 * note: Immuttable are heavy for performance, use wisely.
 * @param {object|string|array} obj a JS object of any type
 * @return {number} 0 for empty object, -1 when something went wrong, else the count of obj
 */
const sizeOf = (obj:any) => {
  let count = 0;
  if (!isEmpty(obj)) {
    if (obj.get && obj.toJS && obj.keySeq) {
      const immutableKeys = obj.keySeq();
      const kArray = immutableKeys && immutableKeys.toArray ? immutableKeys.toArray() : null;
      count = kArray && kArray.length ? kArray.length : -1;
    } else if (obj.size && obj !== {}) {
      count = obj.size;
    } else if (obj.length) {
      count = obj.length;
    } else {
      count = countProperties(obj);
    }
  }

  return count;
};

export {
  isNodejs,
  isReactBrowser,
  pad,
  // isObject,
  isNullOrUndefined,
  isEmpty,
  sizeOf,
  isArray,
};
