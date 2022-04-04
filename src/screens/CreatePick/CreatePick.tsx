import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { PickingState } from '../../state/reducers/Picking';
import { PickListItem, PickStatus } from '../../models/Picking.d';
import { strings } from '../../locales';
import ItemDetails from '../../models/ItemDetails';
import ItemInfo from '../../components/iteminfo/ItemInfo';

interface CreatePickProps {
  picking: PickingState;
}

export const CreatePickScreen = (props: CreatePickProps) => {
  const { picking } = props;

  const item: ItemDetails = {
    categoryNbr: 73,
    itemName: 'treacle tart',
    itemNbr: 2,
    upcNbr: '8675309',
    backroomQty: 765432,
    basePrice: 4.92,
    categoryDesc: 'Deli',
    claimsOnHandQty: 765457,
    completed: false,
    consolidatedOnHandQty: 65346,
    location: {
      reserve: [
        {
          aisleId: 5018,
          aisleName: '1',
          locationName: 'ABAR1-1',
          sectionId: 5019,
          sectionName: '1',
          type: 'reserve',
          typeNbr: 1,
          zoneId: 3632,
          zoneName: 'ABAR'
        }
      ],
      count: 1
    },
    onHandsQty: 76543234,
    pendingOnHandsQty: 2984328947,
    price: 4.92,
    replenishment: {
      onOrder: 100000
    },
    sales: {
      daily: [{
        day: 'Thursday',
        value: 3
      }],
      dailyAvgSales: 500,
      lastUpdateTs: 'right now',
      weekly: [{
        week: 34,
        value: 654
      }],
      weeklyAvgSales: 3500
    }
  };

  return (
    <SafeAreaView>
      <ItemInfo
        category={`${item.categoryNbr} - ${item.categoryDesc}`}
        itemName={item.itemName}
        itemNbr={item.itemNbr}
        upcNbr={item.upcNbr}
        price={item.price}
        status={item.status || ''}
      />
    </SafeAreaView>
  );
};

const CreatePick = () => {
  const picking = useTypedSelector(state => state.Picking);

  return (
    <CreatePickScreen
      picking={picking}
    />
  );
};

export default CreatePick;
