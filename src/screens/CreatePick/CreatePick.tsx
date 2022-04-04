import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { PickingState } from '../../state/reducers/Picking';
import { PickListItem, PickStatus } from '../../models/Picking.d';
import { strings } from '../../locales';

interface CreatePickProps {
  picking: PickingState;
}

export const CreatePickScreen = (props: CreatePickProps) => {
  const { picking } = props;

  const item: PickListItem = {
    assignedAssociate: '',
    category: 73,
    createTS: 'Day before yesterday',
    createdBy: 'me',
    id: 8001,
    itemDesc: 'treacle tart',
    itemNbr: 2,
    moveToFront: false,
    palletId: 12595,
    palletLocationId: 5019,
    palletLocationName: 'ABAR1-1',
    quickPick: false,
    salesFloorLocationId: 5019,
    salesFloorLocationName: 'ABAR1-1',
    status: PickStatus.READY_TO_PICK,
    upcNbr: '8675309'
  };

  const statusString = `PICKING.${item.status.toUpperCase().replace(/\s/g, '_')}`;

  const itemCard = () => (
    <View>
      <Text>{item.itemDesc}</Text>
      <Text>{`${strings('ITEM.ITEM')}: ${item.itemNbr}  |  ${strings('ITEM.UPC')}: ${item.upcNbr}`}</Text>
      <Text>{`${strings('ITEM.STATUS')}: ${strings(statusString)}`}</Text>
      <Text>{`${strings('ITEM.CATEGORY')}: ${item.category}`}</Text>
    </View>
  )

  return (
    <SafeAreaView />
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
