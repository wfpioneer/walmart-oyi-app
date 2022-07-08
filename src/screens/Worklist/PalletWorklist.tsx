import React, {
  Dispatch, EffectCallback, useEffect, useState
} from 'react';
import {
  FlatList, Text, TouchableOpacity, View
} from 'react-native';
import { useDispatch } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import MissingPalletWorklistCard from '../../components/MissingPalletWorklistCard/MissingPalletWorklistCard';
import { strings } from '../../locales';
import { MissingPalletWorklistItemI } from '../../models/WorklistItem';
import { CustomModalComponent } from '../Modal/Modal';
import { styles } from './PalletWorklist.style';
import Button from '../../components/buttons/Button';
import COLOR from '../../themes/Color';
import { clearPallet } from '../../state/actions/saga';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { AsyncState } from '../../models/AsyncState';
import {
  hideActivityModal,
  showActivityModal
} from '../../state/actions/Modal';
import { CLEAR_PALLET } from '../../state/actions/asyncAPI';
import WorklistHeader from '../../components/WorklistHeader/WorklistHeader';

export interface MPWorklistI extends MissingPalletWorklistItemI {
  itemCount?: number;
  sectionID: number;
}

interface PalletWorkListProps {
  palletWorklist: MPWorklistI[];
  displayConfirmation: boolean;
  setDisplayConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  dispatch: Dispatch<any>;
  clearPalletAPI: AsyncState;
  navigation: NavigationProp<any>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
}
interface ListItemProps {
  item: MPWorklistI;
  handleAddLocationClick: () => void;
  handleDeleteClick: (palletID: string) => void;
}

export const clearPalletAPIHook = (
  clearPalletApi: AsyncState,
  palletId: string,
  navigation: NavigationProp<any>,
  dispatch: Dispatch<any>,
  setDisplayConfirmation: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  if (navigation.isFocused()) {
    if (!clearPalletApi.isWaiting) {
      // Success
      if (clearPalletApi.result) {
        dispatch(hideActivityModal());
        setDisplayConfirmation(false);
        dispatch({ type: CLEAR_PALLET.RESET });

        // TODO REFRESH/CALL MISSING PALLET WORKLIST API

        Toast.show({
          type: 'success',
          text1: strings('PALLET.CLEAR_PALLET_SUCCESS', { palletId }),
          position: 'bottom'
        });
      }

      // Failure
      if (clearPalletApi.error) {
        dispatch(hideActivityModal());
        setDisplayConfirmation(false);
        dispatch({ type: CLEAR_PALLET.RESET });
        Toast.show({
          type: 'error',
          text1: strings('PALLET.CLEAR_PALLET_ERROR'),
          text2: strings('GENERICS.TRY_AGAIN'),
          position: 'bottom'
        });
      }
    } else {
      dispatch(showActivityModal());
    }
  }
};

export const RenderWorklistItem = (props: ListItemProps): JSX.Element => {
  const {
    item, handleAddLocationClick, handleDeleteClick
  } = props;
  if (item.palletId === 0) {
    const { lastKnownLocationName, itemCount } = item;
    return (
      <WorklistHeader title={lastKnownLocationName} numberOfItems={itemCount || 0} />
    );
  }

  return (
    <MissingPalletWorklistCard
      palletId={item.palletId}
      lastLocation={item.lastKnownLocationName}
      reportedBy={item.createId}
      reportedDate={item.createTS}
      expanded={false} // TODO Toggle for a single Pallet WorkList Item
      addCallback={handleAddLocationClick}
      deleteCallback={() => handleDeleteClick(item.palletId.toString())}
      navigateCallback={() => {}}
    />
  );
};

export const convertDataToDisplayList = (data: MPWorklistI[], groupToggle: boolean): MPWorklistI[] => {
  if (!groupToggle) {
    const workListItems = data.length
      ? data.sort((a, b) => a.palletId - b.palletId) : [];
    return [{
      worklistType: 'MP',
      palletId: 0,
      lastKnownLocationId: -1,
      lastKnownLocationName: strings('WORKLIST.ALL'),
      itemCount: workListItems.length,
      createId: '',
      createTS: '',
      palletDeleted: false,
      sectionID: 0
    },
    ...workListItems];
  }

  const sortedData = data;
  // first, sort by Loc
  sortedData.sort((firstEl: MPWorklistI, secondEl: MPWorklistI) => {
    if (firstEl.lastKnownLocationName && secondEl.lastKnownLocationName) {
      if (firstEl.lastKnownLocationName < secondEl.lastKnownLocationName) {
        return -1;
      }
      if (firstEl.lastKnownLocationName > secondEl.lastKnownLocationName) {
        return 1;
      }
    }
    return 0;
  });

  // second, sort by section
  let locSecWiseItems: MPWorklistI[] = [];
  let previousLocItem: MPWorklistI;
  let zoneWiseItems: MPWorklistI[] = [];
  sortedData.forEach(item => {
    const currSec = item.lastKnownLocationName.split('-').pop();
    const prevZone = previousLocItem ? previousLocItem.lastKnownLocationName.split('-')[0] : '';
    const currZone = item.lastKnownLocationName.split('-')[0];
    if (!prevZone || (prevZone !== currZone)) {
      if (zoneWiseItems.length) {
        const sortedLocWisePallets = zoneWiseItems.sort((a, b) => a.sectionID - b.sectionID);
        locSecWiseItems = locSecWiseItems.concat(sortedLocWisePallets);
      }
      previousLocItem = item;
      zoneWiseItems = [];
      zoneWiseItems.push({ ...item, sectionID: Number(currSec) });
    } else {
      previousLocItem = item;
      zoneWiseItems.push({ ...item, sectionID: Number(currSec) });
    }
  });

  if (zoneWiseItems.length) {
    const sortedLocWisePallets = zoneWiseItems.sort((a, b) => a.sectionID - b.sectionID);
    locSecWiseItems = locSecWiseItems.concat(sortedLocWisePallets);
  }

  let returnData: MPWorklistI[] = [];

  // Loc than sec than palletid
  let previousItem: MPWorklistI;
  let locWisePallets: MPWorklistI[] = [];
  locSecWiseItems.forEach(item => {
    if (!previousItem || (previousItem.lastKnownLocationId !== item.lastKnownLocationId)) {
      if (locWisePallets.length) {
        returnData[returnData.length - 1].itemCount = locWisePallets.length;
        const sortedLocWisePallets = locWisePallets.sort((a, b) => a.palletId - b.palletId);
        returnData = returnData.concat(sortedLocWisePallets);
      }
      previousItem = item;
      returnData.push({
        worklistType: 'MP',
        palletId: 0,
        lastKnownLocationId: item.lastKnownLocationId,
        lastKnownLocationName: item.lastKnownLocationName,
        createId: '',
        createTS: '',
        palletDeleted: false,
        itemCount: 1,
        sectionID: 0
      });
      locWisePallets = [];
      locWisePallets.push(item);
    } else {
      previousItem = item;
      locWisePallets.push(item);
    }
  });

  if (locWisePallets.length) {
    returnData[returnData.length - 1].itemCount = locWisePallets.length;
    const sortedLocWisePallets = locWisePallets.sort((a, b) => a.palletId - b.palletId);
    returnData = returnData.concat(sortedLocWisePallets);
  }

  return returnData;
};

export const PalletWorklistScreen = (props: PalletWorkListProps) => {
  const {
    clearPalletAPI,
    displayConfirmation,
    dispatch,
    palletWorklist,
    setDisplayConfirmation,
    navigation,
    useEffectHook
  } = props;
  let deletePalletId = '';
  const [groupToggle, updateGroupToggle] = useState(false);

  useEffectHook(() => clearPalletAPIHook(
    clearPalletAPI,
    deletePalletId,
    navigation,
    dispatch,
    setDisplayConfirmation
  ),
  [clearPalletAPI]);

  const onDeletePress = () => {
    dispatch(clearPallet({ palletId: deletePalletId }));
  };

  const handleDeleteClick = (palletId: string) => {
    setDisplayConfirmation(true);
    deletePalletId = palletId;
  };

  const handleAddLocationClick = () => navigation.navigate('ScanPallet');

  return (
    <View style={styles.container}>
      <CustomModalComponent
        isVisible={displayConfirmation}
        modalType="FormHeader"
        onClose={() => {}}
      >
        <View style={styles.delHeader}>
          <Text style={styles.message}>
            {strings('MISSING_PALLET_WORKLIST.DELETE_PALLET')}
          </Text>
        </View>
        <Text style={styles.delText}>
          {strings('MISSING_PALLET_WORKLIST.DELETE_PALLET_CONFIRMATION')}
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            style={styles.delButton}
            title={strings('GENERICS.CANCEL')}
            backgroundColor={COLOR.MAIN_THEME_COLOR}
            onPress={() => setDisplayConfirmation(false)}
          />
          <Button
            style={styles.delButton}
            title={strings('GENERICS.OK')}
            backgroundColor={COLOR.TRACKER_RED}
            onPress={() => onDeletePress()}
          />
        </View>
      </CustomModalComponent>
      <View style={styles.viewSwitcher}>
        <TouchableOpacity onPress={() => updateGroupToggle(false)}>
          <MaterialIcons
            name="menu"
            size={25}
            color={!groupToggle ? COLOR.BLACK : COLOR.GREY}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => updateGroupToggle(true)}>
          <MaterialIcons
            name="list"
            size={25}
            color={groupToggle ? COLOR.BLACK : COLOR.GREY}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={convertDataToDisplayList(palletWorklist, groupToggle)}
        keyExtractor={(item: MPWorklistI, index: number) => {
          if (item.palletId === 0) {
            return item.lastKnownLocationName.toString();
          }
          return item.palletId + index.toString();
        }}
        renderItem={({ item }) => (
          <RenderWorklistItem
            item={item}
            handleAddLocationClick={handleAddLocationClick}
            handleDeleteClick={() => handleDeleteClick(item.palletId.toString())}
          />
        )}
        onRefresh={null}
        refreshing={undefined}
        style={styles.list}
      />
    </View>
  );
};

export const PalletWorkList = () => {
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const clearPalletAPI = useTypedSelector(state => state.async.clearPallet);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const mockMPWorklist: MPWorklistI[] = [
    {
      createId: '11',
      createTS: '26/06/2022',
      lastKnownLocationId: 1,
      lastKnownLocationName: 'A1-1',
      palletDeleted: false,
      palletId: 7988,
      worklistType: 'MP',
      completed: undefined,
      completedId: undefined,
      completedTS: undefined,
      sectionID: 0
    },
    {
      createId: '12',
      createTS: '26/06/2022',
      lastKnownLocationId: 2,
      lastKnownLocationName: 'A1-2',
      palletDeleted: false,
      palletId: 7989,
      worklistType: 'MP',
      completed: undefined,
      completedId: undefined,
      completedTS: undefined,
      sectionID: 0
    },
    {
      createId: '14',
      createTS: '26/06/2022',
      lastKnownLocationId: 5,
      lastKnownLocationName: '1A1-2',
      palletDeleted: false,
      palletId: 7777,
      worklistType: 'MP',
      completed: undefined,
      completedId: undefined,
      completedTS: undefined,
      sectionID: 0
    },
    {
      createId: '15',
      createTS: '26/06/2022',
      lastKnownLocationId: 2,
      lastKnownLocationName: 'A1-2',
      palletDeleted: false,
      palletId: 888,
      worklistType: 'MP',
      completed: undefined,
      completedId: undefined,
      completedTS: undefined,
      sectionID: 0
    },
    {
      createId: '15',
      createTS: '26/06/2022',
      lastKnownLocationId: 8,
      lastKnownLocationName: 'A1-11',
      palletDeleted: false,
      palletId: 8889,
      worklistType: 'MP',
      completed: undefined,
      completedId: undefined,
      completedTS: undefined,
      sectionID: 0
    }
  ];
  return (
    <PalletWorklistScreen
      palletWorklist={mockMPWorklist}
      displayConfirmation={displayConfirmation}
      setDisplayConfirmation={setDisplayConfirmation}
      dispatch={dispatch}
      clearPalletAPI={clearPalletAPI}
      navigation={navigation}
      useEffectHook={useEffect}
    />
  );
};
