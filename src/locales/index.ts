import * as RNLocalize from 'react-native-localize';
import I18n from 'i18n-js';
// @ts-ignore
import moment from 'moment';
import 'moment/locale/es';
import en from './en';
import es from './es';

export const setI18nConfig: () => void = () => {
  // fallback if no available language fits
  const fallback = { languageTag: 'en', isRTL: false };

  const { languageTag } = RNLocalize.findBestAvailableLanguage(['en', 'es'])
    || fallback;

  // set i18n-js config
  I18n.translations = { en, es };
  I18n.locale = languageTag;

  // the following is to set up moment to work with spanish localization
  moment.locale(languageTag);
};

export const strings: (
  tag: string,
  options?: I18n.TranslateOptions | undefined,
) => string = (tag: string, options: I18n.TranslateOptions | undefined = {}) => I18n.t(tag, options);

export const currencies: (
  value: number,
  options?: I18n.ToCurrencyOptions | undefined
) => string = (value: number, options: I18n.ToCurrencyOptions | undefined = {}) => I18n.toCurrency(value, options);

export const numbers: (
  value: number,
  options?: I18n.ToNumberOptions | undefined
) => string = (value: number, options: I18n.ToNumberOptions | undefined = {}) => I18n.toNumber(value, options);
