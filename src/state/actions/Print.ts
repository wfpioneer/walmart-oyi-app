export const SET_SELECTED_PRINTER = 'PRINT/SET_SELECTED_PRINTER';
export const SET_SIGN_TYPE = 'PRINT/SET_SIGN_TYPE';

export const setSelectedPrinter = (printer: { type: string, name: string, desc: string }) => {
  return {
    type: SET_SELECTED_PRINTER,
    payload: printer
  }
}

export const setSignType = (type: string) => {
  return {
    type: SET_SIGN_TYPE,
    payload: type
  }
}
