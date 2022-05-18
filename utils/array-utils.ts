import { DateUtils } from './date-utils';
import { PagedDataContainer } from 'src/app/shared/model/paged-data/paged-data-container';
import { RegexUtils } from './regex-utils';
import { KeyValuePair } from '../model/key-value-pair';

export class ArrayUtils {

  static getUniqueList(array: any[], field: string) {
    if (array && array.length > 0) {
      return [...new Map(array.map(item =>
        [item[field], item])).values()];
    }
  }
}
