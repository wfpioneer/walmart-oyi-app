import React, { useState } from 'react';
import {
  FlatList, Text, TouchableOpacity, View
} from 'react-native';
import { groupBy, uniq } from 'lodash';
import {
  NavigationProp, useNavigation
} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Checkbox } from 'react-native-paper';
import { Dispatch } from 'redux';
import PickPalletInfoCard from '../PickPalletInfoCard/PickPalletInfoCard';
import {
  PickListItem, PickStatus, Tabs
} from '../../models/Picking.d';
import styles from './ListGroup.style';
import COLOR from '../../themes/Color';
import { selectPicks, updateMultiPickSelection } from '../../state/actions/Picking';

interface ListGroupProps {
  title: string;
  pickListItems: PickListItem[];
  groupItems?: boolean;
  currentTab: Tabs;
  dispatch: Dispatch<any>;
  multiBinEnabled?: boolean;
  multiPickEnabled?: boolean;
}

interface CollapsibleCardProps {
  title: string;
  isOpened: boolean;
  toggleIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
  showCheckboxSel: boolean;
  pickListWithStatusReady: PickListItem[];
  dispatch: Dispatch<any>;
}

const getItemsByStatusEnabled = (
  multiBinEnabled: boolean | undefined,
  multiPickEnabled: boolean | undefined,
  items: PickListItem[]
): PickListItem[] => {
  if (multiBinEnabled) {
    return items.filter(item => item.status === PickStatus.READY_TO_BIN);
  }
  if (multiPickEnabled) {
    return items.filter(item => item.status === PickStatus.READY_TO_PICK);
  }
  return [];
};

const getGroupHeaderCheckStatus = (pickListWithStatusReady: PickListItem[]):
  ('checked' | 'unchecked' | 'indeterminate') => {
  const selPickList = pickListWithStatusReady.filter(itm => itm.isSelected);
  if (selPickList?.length && selPickList?.length === pickListWithStatusReady.length) {
    return 'checked';
  }
  if (selPickList?.length) {
    return 'indeterminate';
  }
  return 'unchecked';
};
const toggleMultiPickSelection = (
  currentCheckStatus: string,
  dispatch: Dispatch<any>,
  items: PickListItem[]
) => {
  if (currentCheckStatus === 'unchecked') {
    dispatch(updateMultiPickSelection(items, true));
  } else {
    dispatch(updateMultiPickSelection(items, false));
  }
};

export const CollapsibleCard = (props: CollapsibleCardProps): JSX.Element => {
  const {
    title, isOpened, toggleIsOpened, showCheckboxSel, dispatch, pickListWithStatusReady
  } = props;
  const iconName = isOpened ? 'keyboard-arrow-up' : 'keyboard-arrow-down';
  const checkedStatus = getGroupHeaderCheckStatus(pickListWithStatusReady);
  return (
    <View style={showCheckboxSel ? styles.menuSelContainer : styles.menuContainer}>
      <View style={styles.titleContainer}>
        {showCheckboxSel && (
        <Checkbox
          status={checkedStatus}
          onPress={() => toggleMultiPickSelection(
            checkedStatus,
            dispatch,
            pickListWithStatusReady
          )}
          color={COLOR.TRAINING_BLUE_DARK}
          uncheckedColor={COLOR.TRAINING_BLUE_DARK}
        />
        )}
        <Text style={styles.titleText}>{title}</Text>
      </View>
      <TouchableOpacity
        testID="collapsible-card"
        onPress={() => toggleIsOpened(!isOpened)}
        style={showCheckboxSel ? styles.arrowPadding : {}}
      >
        <MaterialIcons name={iconName} size={25} color={COLOR.BLACK} />
      </TouchableOpacity>
    </View>
  );
};

const sortPickListByPalletLocation = (items: PickListItem[]) => (items.sort(
  (a, b) => (a.palletLocationName > b.palletLocationName ? 1 : -1)
));

const sortPickListByCreatedDate = (items: PickListItem[]) => (
  items.sort(
    (a, b) => new Date(a.createTs).valueOf() - new Date(b.createTs).valueOf()
  ));

const getGroupItemsBasedOnPallet = (items: PickListItem[]) => {
  const sortedItems = sortPickListByPalletLocation(items);
  return groupBy(sortedItems, item => item.palletId);
};

const pickOrBin = (item: PickListItem) => item.status === PickStatus.ACCEPTED_BIN
  || item.status === PickStatus.ACCEPTED_PICK
  || item.status === PickStatus.READY_TO_BIN
  || item.status === PickStatus.READY_TO_PICK;

const handleWorkflowNav = (
  currentTab: Tabs,
  items: PickListItem[],
  navigation: NavigationProp<any>,
  dispatch: Dispatch<any>
) => {
  dispatch(selectPicks(items.reduce((pickIds: number[], pickItem) => [...pickIds, pickItem.id], [])));
  if (currentTab !== Tabs.SALESFLOOR && pickOrBin(items[0])) {
    navigation.navigate('PickBinWorkflow');
  } else {
    navigation.navigate('SalesFloorWorkflow');
  }
};

const renderPickPalletInfoList = (
  items: PickListItem[],
  navigation: NavigationProp<any>,
  currentTab: Tabs,
  dispatch: Dispatch<any>,
  multiBinEnabled: boolean | undefined,
  multiPickEnabled: boolean | undefined
) => {
  const item = items[0];
  const showCheckBox = (multiBinEnabled && item.status === PickStatus.READY_TO_BIN)
  || (multiPickEnabled && item.status === PickStatus.READY_TO_PICK);
  return (
    <PickPalletInfoCard
      onPress={() => {
        if (!multiBinEnabled && !multiPickEnabled) {
          handleWorkflowNav(currentTab, items, navigation, dispatch);
        }
      }}
      palletId={item.palletId}
      palletLocation={item.palletLocationName}
      pickListItems={items}
      pickStatus={item.status}
      canDelete={!multiBinEnabled && !multiPickEnabled}
      dispatch={dispatch}
      isSelected={item.isSelected}
      showCheckBoxSel={!!showCheckBox}
    />
  );
};

const renderGroupItems = (
  items: PickListItem[],
  navigation: NavigationProp<any>,
  currentTab: Tabs,
  dispatch: Dispatch<any>,
  multiBinEnabled: boolean | undefined,
  multiPickEnabled: boolean | undefined
) => {
  const groupedItemList = getGroupItemsBasedOnPallet(items);
  const sortedPalletIdsBasedonLocation = uniq(
    sortPickListByPalletLocation(items).map(item => item.palletId.toString())
  );
  return (
    <FlatList
      data={sortedPalletIdsBasedonLocation}
      renderItem={({ item }) => renderPickPalletInfoList(
        groupedItemList[item],
        navigation,
        currentTab,
        dispatch,
        multiBinEnabled,
        multiPickEnabled
      )}
      scrollEnabled={false}
      keyExtractor={(item, index) => `ListGroup-${item}-${index}`}
    />
  );
};

const renderItems = (
  items: PickListItem[],
  navigation: NavigationProp<any>,
  currentTab: Tabs,
  dispatch: Dispatch<any>,
  multiBinEnabled: boolean | undefined,
  multiPickEnabled: boolean | undefined
) => {
  const pickListItems = sortPickListByCreatedDate(items);
  return (
    <FlatList
      data={pickListItems}
      renderItem={({ item }) => renderPickPalletInfoList(
        [item], navigation, currentTab, dispatch, multiBinEnabled, multiPickEnabled
      )}
      scrollEnabled={false}
      keyExtractor={(item, index) => `ListGroup-${item}-${index}`}
    />
  );
};

const ListGroup = (props: ListGroupProps): JSX.Element => {
  const {
    title, pickListItems, groupItems, currentTab, dispatch, multiBinEnabled, multiPickEnabled
  } = props;

  const [listGroupOpen, toggleListGroup] = useState(true);
  const navigation = useNavigation();
  const pickListWithStatusReady = getItemsByStatusEnabled(multiBinEnabled, multiPickEnabled, pickListItems);
  const showCheckboxSel = !!groupItems
  && currentTab === Tabs.PICK
  && !!pickListWithStatusReady?.length;

  return (
    <View>
      <CollapsibleCard
        title={title}
        isOpened={listGroupOpen}
        toggleIsOpened={toggleListGroup}
        pickListWithStatusReady={pickListWithStatusReady}
        showCheckboxSel={showCheckboxSel}
        dispatch={dispatch}
      />
      {listGroupOpen && (
        <View>
          {groupItems
            ? renderGroupItems(pickListItems, navigation, currentTab, dispatch, multiBinEnabled, multiPickEnabled)
            : renderItems(pickListItems, navigation, currentTab, dispatch, multiBinEnabled, multiPickEnabled)}
        </View>
      )}
    </View>
  );
};

ListGroup.defaultProps = {
  groupItems: false,
  multiBinEnabled: false,
  multiPickEnabled: false
};

export default ListGroup;
