import React from 'react';
import {
  FlatList, SafeAreaView, Text, View
} from 'react-native';
import { groupBy, partition } from 'lodash';
import { PickingState } from '../../state/reducers/Picking';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import User from '../../models/User';
import { PickListItem } from '../../models/Picking.d';
import ListGroup from '../../components/ListGroup/ListGroup';
import { strings } from '../../locales';
import styles from './PickBinTab.style';
import ManualScan from '../../components/manualscan/ManualScan';

interface PickBinTabProps {
  picking: PickingState;
  user: User;
  isManualScanEnabled: boolean;
}

const ASSIGNED_TO_ME = 'assignedToMe';

const getZoneFromPalletLocation = (palletLocation: string|undefined) => (palletLocation ? palletLocation.substring(0,
  palletLocation.indexOf('-')).replace(/[\d.]+$/, '') : '');

export const PickBinTabScreen = (props: PickBinTabProps) => {
  const { picking, user, isManualScanEnabled } = props;
  const [assignedToMe, otherPickList] = partition(picking.pickList, pick => pick.assignedAssociate === user.userId);
  const groupedPickListByZone = groupBy(otherPickList,
    (item: PickListItem) => getZoneFromPalletLocation(item.palletLocationName));
  const sortedZones = Object.keys(groupedPickListByZone).sort((a, b) => (a > b ? 1 : -1));
  const allGroupKeys = [ASSIGNED_TO_ME, ...sortedZones];

  return (
    <SafeAreaView style={styles.container}>
      {/* placeholder for ManualScan need to implement functionality later */}
      {isManualScanEnabled && <ManualScan placeholder={strings('GENERICS.ENTER_UPC_ITEM_NBR')} />}
      <FlatList
        data={allGroupKeys}
        renderItem={({ item }) => {
          const title = item === ASSIGNED_TO_ME ? `${strings('PICKING.ASSIGNED_TO_ME')}(${assignedToMe.length})`
            : `${item}(${groupedPickListByZone[item].length})`;
          const items = item === ASSIGNED_TO_ME ? assignedToMe : groupedPickListByZone[item];
          return (
            <ListGroup
              title={title}
              pickListItems={items}
              groupItems
            />
          );
        }}
        keyExtractor={(item, index) => `listGroup-${item}-${index}`}
      />
      <View style={styles.scanItemLabel}>
        <Text>{strings('PICKING.SCAN_ITEM_LABEL')}</Text>
      </View>
    </SafeAreaView>
  );
};

const PickBinTab = () => {
  const picking = useTypedSelector(state => state.Picking);
  const user = useTypedSelector(state => state.User);
  const isManualScanEnabled = useTypedSelector(state => state.Global.isManualScanEnabled);

  return (
    <PickBinTabScreen
      picking={picking}
      user={user}
      isManualScanEnabled={isManualScanEnabled}
    />
  );
};

export default PickBinTab;
