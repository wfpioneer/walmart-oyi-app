import React, { useState } from 'react';
import {
  FlatList, SafeAreaView, Text, View
} from 'react-native';
import { groupBy, partition } from 'lodash';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import COLOR from '../../themes/Color';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import User from '../../models/User';
import { PickListItem, Tabs } from '../../models/Picking.d';
import ListGroup from '../../components/ListGroup/ListGroup';
import { strings } from '../../locales';
import styles from './PickBinTab.style';
import ManualScan from '../../components/manualscan/ManualScan';
import { CustomModalComponent } from '../Modal/Modal';
import Button, { ButtonType } from '../../components/buttons/Button';
import { resetMultiPickBinSelection, toggleMultiBin, toggleMultiPick } from '../../state/actions/Picking';
import { ButtonBottomTab } from '../../components/buttonTabCard/ButtonTabCard';

interface PickBinTabProps {
  pickBinList: PickListItem[];
  refreshing: boolean;
  onRefresh: () => void;
}
interface PickBinTabScreenProps {
  pickBinList: PickListItem[];
  user: User;
  isManualScanEnabled: boolean;
  dispatch: Dispatch<any>;
  refreshing: boolean;
  onRefresh: () => void;
  showMultiPickConfirmationDialog: boolean;
  setShowMultiPickConfirmationDialog: React.Dispatch<React.SetStateAction<boolean>>;
  multiBinEnabled: boolean;
  multiPickEnabled: boolean;
}

const ASSIGNED_TO_ME = 'assignedToMe';

const getZoneFromPalletLocation = (palletLocation: string|undefined) => (palletLocation ? palletLocation.substring(0,
  palletLocation.indexOf('-')).replace(/[\d.]+$/, '') : '');

export const renderMultipickConfirmationDialog = (
  pickBinList: PickListItem[],
  showMultiPickConfirmationDialog: boolean,
  setShowMultiPickConfirmationDialog: React.Dispatch<React.SetStateAction<boolean>>,
  multiBinEnabled: boolean,
  multiPickEnabled: boolean
) => {
  const selectedItems = pickBinList.filter(item => item.isSelected);
  return (
    <CustomModalComponent
      isVisible={showMultiPickConfirmationDialog}
      onClose={() => setShowMultiPickConfirmationDialog(false)}
      modalType="FormHeader"
      minHeight={150}
    >
      <View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {multiBinEnabled && strings('PICKING.ACCEPT_MULTIPLE_BINS')}
            {multiPickEnabled && strings('PICKING.ACCEPT_MULTIPLE_PICKS')}
          </Text>
        </View>
        <View>
          <View style={styles.descriptionText}>
            <Text>
              {multiBinEnabled && strings('PICKING.ACCEPT_FOLLOWING_BINS')}
              {multiPickEnabled && strings('PICKING.ACCEPT_FOLLOWING_PICKS')}
            </Text>
          </View>
          <FlatList
            data={selectedItems}
            renderItem={({ item }) => (
              <View style={styles.pickBinItemView}>
                <Text>{`${strings('LOCATION.PALLET')} ${item.palletId}`}</Text>
                <Text>{`${strings('PICKING.LOC_LABEL')}: ${item.palletLocationName}`}</Text>
              </View>
            )}
            style={styles.pickBinListView}
            keyExtractor={item => `${item.palletId}-${item.palletLocationName}`}
          />
        </View>
        <View style={styles.actionRow}>
          <Button
            testID="cancelButton"
            title={strings('GENERICS.CANCEL')}
            onPress={() => setShowMultiPickConfirmationDialog(false)}
            type={ButtonType.SOLID_WHITE}
            titleColor={COLOR.MAIN_THEME_COLOR}
            style={styles.cancelButton}
          />
          <Button
            testID="acceptButton"
            title={strings('PICKING.ACCEPT')}
            onPress={() => {
              // Handle the API call to update the pick
              setShowMultiPickConfirmationDialog(false);
            }}
            type={ButtonType.PRIMARY}
            style={styles.acceptButton}
          />
        </View>
      </View>
    </CustomModalComponent>
  );
};

export const disableMultiPickBin = (multiBinEnabled: boolean, multiPickEnabled: boolean, dispatch: Dispatch<any>) => {
  if (multiBinEnabled) {
    dispatch(toggleMultiBin(false));
  }
  if (multiPickEnabled) {
    dispatch(toggleMultiPick(false));
  }
};

export const PickBinTabScreen = (props: PickBinTabScreenProps) => {
  const {
    pickBinList, user, isManualScanEnabled, dispatch, onRefresh, refreshing, multiBinEnabled, multiPickEnabled,
    setShowMultiPickConfirmationDialog, showMultiPickConfirmationDialog
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
      {renderMultipickConfirmationDialog(
        pickBinList, showMultiPickConfirmationDialog, setShowMultiPickConfirmationDialog,
        multiBinEnabled, multiPickEnabled
      )}
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
              multiBinEnabled={multiBinEnabled}
              multiPickEnabled={multiPickEnabled}
            />
          );
        }}
        keyExtractor={(item, index) => `listGroup-${item}-${index}`}
        refreshing={refreshing}
        onRefresh={(!multiBinEnabled && !multiPickEnabled) ? onRefresh : null}
      />
      {multiBinEnabled || multiPickEnabled
        ? (
          <ButtonBottomTab
            leftTitle={strings('GENERICS.CANCEL')}
            onLeftPress={() => dispatch(resetMultiPickBinSelection())}
            rightTitle={strings('GENERICS.CONTINUE')}
            onRightPress={() => setShowMultiPickConfirmationDialog(true)}
          />
        )
        : (
          <View style={styles.scanItemLabel}>
            <Text>{strings('PICKING.SCAN_ITEM_LABEL')}</Text>
          </View>
        )}
    </SafeAreaView>
  );
};

const PickBinTab = (props: PickBinTabProps) => {
  const {
    pickBinList, onRefresh, refreshing
  } = props;
  const dispatch = useDispatch();
  const user = useTypedSelector(state => state.User);
  const { multiBinEnabled, multiPickEnabled } = useTypedSelector(state => state.Picking);
  const isManualScanEnabled = useTypedSelector(state => state.Global.isManualScanEnabled);
  const [showMultiPickConfirmationDialog, setShowMultiPickConfirmationDialog] = useState(false);

  return (
    <PickBinTabScreen
      pickBinList={pickBinList}
      user={user}
      isManualScanEnabled={isManualScanEnabled}
      dispatch={dispatch}
      refreshing={refreshing}
      onRefresh={onRefresh}
      showMultiPickConfirmationDialog={showMultiPickConfirmationDialog}
      setShowMultiPickConfirmationDialog={setShowMultiPickConfirmationDialog}
      multiBinEnabled={multiBinEnabled}
      multiPickEnabled={multiPickEnabled}
    />
  );
};

export default PickBinTab;
