import { DateUtils } from './date-utils';
import { RegexUtils } from './regex-utils';

export class ObjectUtils {


  static clone<T>(source: any, target: T) {
    if (source) {
      Object.keys(target).forEach(key => {
        // needed for pm objects that contain date as property names
        const isValidDate = RegexUtils.validIncomingDate.test((key in source ? source : target)[key]);
        if (typeof (target[key]) === 'number') {
          target[key] = +(key in source ? source : target)[key];
        } else if (key.indexOf('Date') !== -1 && !key.includes('Format') && isValidDate) {
          const value = (key in source ? source : target)[key];
          if (value) {
            target[key] = new Date(value);
          } else {
            target[key] = value;
          }
        } else {
          target[key] = (key in source ? source : target)[key];
        }
      });
    }

  }

  //init object. numbers, dates
  static init<T>(source: Partial<T>) {
    if (source) {
      Object.keys(source).forEach(key => {
        // needed for pm objects that contain date as property names

        const isValidDate = DateUtils.isDate( source[key]);

        if (typeof (source[key]) === 'number') {
          source[key] = +source[key];
        } else if (isValidDate) {
          const value = source[key];
          if (value) {
            source[key] = new Date(value);
          } else {
            source[key] = value;
          }
        }
        else {
          source[key]=source[key]
        }
      });
    }
    return source;
  }

  // merge 2 objects, source values will merge to target values
  static merge(source: any, target: any) {
    if(!target){
      target = {};
    }
    if (source) {
      Object.keys(source).forEach(key => {
        target[key] = source[key];
      });
    }
    return target;
  }

  static createGuid()
  {
     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
     });
  }

 static parseXmlToJson(xml) {
    const json = {};
    for (const res of xml.matchAll(/(?:<(\w*)(?:\s[^>]*)*>)((?:(?!<\1).)*)(?:<\/\1>)|<(\w*)(?:\s*)*\/>/gm)) {
        const key = res[1] || res[3];
        const value = res[2] && this.parseXmlToJson(res[2]);
        json[key] = ((value && Object.keys(value).length) ? value : res[2]) || null;

    }
    return json;
}

  static transformArray<T>(array: Array<T>, create: (data) => T): Array<T> {
    if (array) {
      const transformed = new Array<T>();
      array.forEach(item => transformed.push(create(item)));
      array = transformed;
      return array;
    }
  }


  static create<T>(type: (new (data) => T), data: any): T {
    return new type(data);
  }

  static NoOp(): any {
    return {};
  }
}
