import { strings } from '../../locales';

// Needs to be a function to get the proper translations
export const FullExceptionList = (): Map<string, string> => new Map([
  ['NP', strings('EXCEPTION.NIL_PICK')],
  ['PO', strings('EXCEPTION.PRICE_OVERRIDE')],
  ['NS', strings('EXCEPTION.NO_SALES')],
  ['NO', strings('EXCEPTION.NEGATIVE_ON_HANDS')],
  ['C', strings('EXCEPTION.CANCELLED')],
  ['NSFL', strings('EXCEPTION.NSFL')]
]);

export const exceptionTypeToDisplayString = (exceptionType: string): string => {
  switch (exceptionType.toUpperCase()) {
    case 'NP':
      return strings('EXCEPTION.NIL_PICK');
    case 'PO':
      return strings('EXCEPTION.PRICE_OVERRIDE');
    case 'NS':
      return strings('EXCEPTION.NO_SALES');
    case 'NO':
      return strings('EXCEPTION.NEGATIVE_ON_HANDS');
    case 'C':
      return strings('EXCEPTION.CANCELLED');
    case 'NSFL':
      return strings('EXCEPTION.NSFL');
    default:
      return strings('EXCEPTION.UNKNOWN');
  }
};
