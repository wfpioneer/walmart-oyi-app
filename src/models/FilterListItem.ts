/* eslint-disable no-shadow */
export interface FilterListItem {
    value: string;
    display: string;
    selected: boolean;
  }

export interface FilteredCategory {
    catgNbr?: number;
    catgName: string;
    selected: boolean;
  }

export enum FilterType {
  CATEGORY = 'CATEGORY',
  EXCEPTION = 'EXCEPTION',
  SOURCE = 'SOURCE',
  AREA = 'AREA'
}
