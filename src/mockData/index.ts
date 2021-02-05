import itemDetails from './getItemDetails';

export const getMockItemDetails = (upc: string) =>
  // @ts-ignore - linter error disabled to allow this comment to remain.
  itemDetails[upc] || {}; // eslint-disable-line implicit-arrow-linebreak
