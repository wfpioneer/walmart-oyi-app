import I18n from 'i18n-js';
import { strings } from '../../locales';

const multitonMap = new Map();

export const GenerateExceptionList = (function exceptionInstance() {
  let instance: Map<string, string>;

  function createInstance() {
    return new Map([
      ['NP', strings('EXCEPTION.NIL_PICK',)],
      ['PO', strings('EXCEPTION.PRICE_OVERRIDE')],
      ['NS', strings('EXCEPTION.NO_SALES')],
      ['NO', strings('EXCEPTION.NEGATIVE_ON_HANDS')],
      ['C', strings('EXCEPTION.CANCELLED')],
      ['NSFL', strings('EXCEPTION.NSFL')]
    ]);
  }

  return {
    getInstance() {
      // Creates a new map instance if the current language has not been used yet
      if (!multitonMap.has(I18n.locale) && Object.keys(I18n.translations).length !== 0) {
        multitonMap.set(I18n.locale, createInstance());
      }
      instance = multitonMap.get(I18n.locale);
      return instance;
    }
  };
}());

export const exceptionTypeToDisplayString = (exceptionType: string):
string => GenerateExceptionList.getInstance().get(exceptionType) ?? strings('EXCEPTION.UNKNOWN');
