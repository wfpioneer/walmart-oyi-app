import I18n from 'i18n-js';
import { strings } from '../../locales';

export class ExceptionList {
  private static readonly multitonMap = new Map();

   private static instance: Map<string, string>

   private constructor() {}

   private static createInstance() {
     return new Map([
       ['NP', strings('EXCEPTION.NIL_PICK',)],
       ['PO', strings('EXCEPTION.PRICE_OVERRIDE')],
       ['NS', strings('EXCEPTION.NO_SALES')],
       ['NO', strings('EXCEPTION.NEGATIVE_ON_HANDS')],
       ['C', strings('EXCEPTION.CANCELLED')],
       ['NSFL', strings('EXCEPTION.NSFL')]
     ]);
   }

   public static getInstance(): Map<string, string> {
     /* Creates a new map instance if the current language has not been used yet and translations are available
      or if Jest tests are being Ran */
     if ((!this.multitonMap.has(I18n.locale) && Object.keys(I18n.translations).length !== 0)
     || process.env.JEST_WORKER_ID) {
       this.multitonMap.set(I18n.locale, this.createInstance());
     }

     ExceptionList.instance = this.multitonMap.get(I18n.locale);
     return ExceptionList.instance;
   }
}

export const exceptionTypeToDisplayString = (exceptionType: string):
string => ExceptionList.getInstance().get(exceptionType) ?? strings('EXCEPTION.UNKNOWN');
