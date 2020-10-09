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
