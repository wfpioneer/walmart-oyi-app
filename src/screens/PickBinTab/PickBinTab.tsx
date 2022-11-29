import React from 'react';
import {
  FlatList, SafeAreaView, Text, View
} from 'react-native';
import { groupBy, partition } from 'lodash';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import User from '../../models/User';
import { PickListItem, Tabs } from '../../models/Picking.d';
import ListGroup from '../../components/ListGroup/ListGroup';
import { strings } from '../../locales';
import styles from './PickBinTab.style';
import ManualScan from '../../components/manualscan/ManualScan';

interface PickBinTabProps {
  pickBinList: PickListItem[];
  refreshing: boolean;
  onRefresh: () => void;
  multiBinEnabled: boolean;
  multiPickEnabled: boolean;
}
interface PickBinTabScreenProps {
  pickBinList: PickListItem[];
  user: User;
  isManualScanEnabled: boolean;
  dispatch: Dispatch<any>;
  refreshing: boolean;
  onRefresh: () => void;
  multiBinEnabled: boolean;
  multiPickEnabled: boolean;
}

const ASSIGNED_TO_ME = 'assignedToMe';

const getZoneFromPalletLocation = (palletLocation: string|undefined) => (palletLocation ? palletLocation.substring(0,
  palletLocation.indexOf('-')).replace(/[\d.]+$/, '') : '');

export const PickBinTabScreen = (props: PickBinTabScreenProps) => {
  const {
    pickBinList, user, isManualScanEnabled, dispatch, onRefresh, refreshing, multiBinEnabled, multiPickEnabled
  } = props;
  const [assignedToMe, otherPickList] = partition(pickBinList, pick => pick.assignedAssociate === user.userId);
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
              currentTab={Tabs.PICK}
              dispatch={dispatch}
              multiPickEnabled={multiPickEnabled}
              multiBinEnabled={multiBinEnabled}
            />
          );
        }}
        keyExtractor={(item, index) => `listGroup-${item}-${index}`}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      <View style={styles.scanItemLabel}>
        <Text>{strings('PICKING.SCAN_ITEM_LABEL')}</Text>
      </View>
    </SafeAreaView>
  );
};

const PickBinTab = (props: PickBinTabProps) => {
  const {
    pickBinList, onRefresh, refreshing, multiBinEnabled, multiPickEnabled
  } = props;
  const dispatch = useDispatch();
  const user = useTypedSelector(state => state.User);
  const isManualScanEnabled = useTypedSelector(state => state.Global.isManualScanEnabled);

  return (
    <PickBinTabScreen
      pickBinList={pickBinList}
      user={user}
      isManualScanEnabled={isManualScanEnabled}
      dispatch={dispatch}
      refreshing={refreshing}
      onRefresh={onRefresh}
      multiBinEnabled={multiBinEnabled}
      multiPickEnabled={multiPickEnabled}
    />
  );
};

export default PickBinTab;
