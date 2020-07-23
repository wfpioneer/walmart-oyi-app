
import itemDetails from './getItemDetails';


export const getMockItemDetails = (upc: string) => {
  // @ts-ignore
  return itemDetails[upc] || {};
};
