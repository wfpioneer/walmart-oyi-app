import {
  CombinePallet,
  PalletInfo,
  PalletItem
} from '../models/PalletManagementTypes';

export const mockPalletItems: PalletItem[] = [
  {
    itemNbr: 1255,
    upcNbr: '1234567890',
    itemDesc: 'test',
    quantity: 3,
    newQuantity: 3,
    price: 10.0,
    categoryNbr: 54,
    categoryDesc: 'test cat',
    deleted: true,
    added: false,
    locationName: 'ARAR1-1'
  },
  {
    itemNbr: 1234,
    upcNbr: '12345678901',
    itemDesc: 'test',
    quantity: 3,
    newQuantity: 4,
    price: 10.0,
    categoryNbr: 54,
    categoryDesc: 'test cat',
    deleted: false,
    added: false,
    locationName: 'ARAR1-1'
  },
  {
    itemNbr: 4221,
    upcNbr: '765432123456',
    itemDesc: 'food',
    quantity: 2,
    newQuantity: 1,
    price: 3.49,
    categoryNbr: 72,
    categoryDesc: 'deli',
    deleted: false,
    added: false,
    locationName: 'ARAR1-1'
  }
];

export const mockPalletInfo: PalletInfo = {
  id: '1514',
  expirationDate: '01/31/2022'
};

export const mockPallet = {
  palletInfo: mockPalletInfo,
  items: mockPalletItems
};
export const mockCombinePallet: CombinePallet[] = [
  {
    palletId: '789',
    itemCount: 7
  },
  {
    palletId: '902',
    itemCount: 4
  }
];

export const mockCombinePalletItem: CombinePallet = {
  palletId: '123',
  itemCount: 7
};

export const mockPalletItem: PalletItem = {
  itemNbr: 123456,
  upcNbr: '123456000789',
  itemDesc: 'Cabbage',
  quantity: 3,
  newQuantity: 2,
  price: 10.0,
  categoryNbr: 50,
  categoryDesc: 'test',
  deleted: false,
  added: false
};

export const mockManagePalletMenu = false;
export const mockPerishableCategoriesList = [];
export const mockCreatePallet = false;
