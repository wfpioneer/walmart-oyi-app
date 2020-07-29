import React from 'react';
import {WorklistItemI} from "../../models/WorklistItem";
import { Worklist } from './Worklist';

export const CompletedWorklist = () => {
  const dummyData: WorklistItemI[] = [
    {
      exceptionType: 'No sales floor location',
      itemName: 'Hotel Premier Collection King Pillow by Member\'s Mark (2 pk.)',
      itemNbr: 980145693,
      upcNbr: '123456789012',
      catgNbr: 21,
      catgName: 'DOMESTICS',
      isCompleted: false
    },
    {
      exceptionType: 'No sales floor location',
      itemName: 'Member\'s Mark Parmesan Crisps (9.5oz)',
      itemNbr: 980039376,
      upcNbr: '123456789012',
      catgNbr: 46,
      catgName: 'CAN PROTEIN - CONDIMENTS - PASTA',
      isCompleted: false
    },
    {
      exceptionType: 'No sales floor location',
      itemName: 'Dole 100% Pineapple Juice (8.4oz / 24pk)',
      itemNbr: 464033,
      upcNbr: '123456789012',
      catgNbr: 40,
      catgName: 'JUICE - WATER - SPORTS DRINKS',
      isCompleted: false
    },
    {
      exceptionType: 'No sales floor location',
      itemName: 'Member\'s Mark Parmesan Crisps (9.5oz)',
      itemNbr: 980039378,
      upcNbr: '123456789012',
      catgNbr: 46,
      catgName: 'CAN PROTEIN - CONDIMENTS - PASTA',
      isCompleted: false
    }
  ];

  return (
    <Worklist data={dummyData} />
  )
}
