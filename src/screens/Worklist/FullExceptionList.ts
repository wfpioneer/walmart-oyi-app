import { strings } from '../../locales';

export default () => [
  {
    value: 'NP',
    display: strings('EXCEPTION.NIL_PICK')
  },
  {
    value: 'PO',
    display: strings('EXCEPTION.PRICE_OVERRIDE')
  },
  {
    value: 'NS',
    display: strings('EXCEPTION.NO_SALES')
  },
  {
    value: 'NO',
    display: strings('EXCEPTION.NEGATIVE_ON_HANDS')
  },
  {
    value: 'C',
    display: strings('EXCEPTION.CANCELLED')
  },
  {
    value: 'NSFL',
    display: strings('EXCEPTION.NSFL')
  }
];

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
