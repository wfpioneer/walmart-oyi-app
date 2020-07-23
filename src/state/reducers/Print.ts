import { SET_SELECTED_PRINTER, SET_SIGN_TYPE } from '../actions/Print';
import { strings } from '../../locales';


const initialState = {
  selectedPrinter: {
    type: 'LASER',
    name: '',
    desc: ''
  },
  signType: ''
}

export const Print = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_SELECTED_PRINTER:
      return {
        ...state,
        selectedPrinter: {
          type: action.payload.type,
          name: action.payload.name,
          desc: action.payload.desc
        }
      }
    case SET_SIGN_TYPE:
      return {
        ...state,
        signType: action.payload
      }
    default:
      return state;
  }
}
