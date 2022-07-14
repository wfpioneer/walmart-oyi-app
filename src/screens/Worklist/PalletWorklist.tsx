import React, { Dispatch, EffectCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NavigationProp } from '@react-navigation/native';
import { AxiosError } from 'axios';
import MissingPalletWorklistCard from '../../components/MissingPalletWorklistCard/MissingPalletWorklistCard';
import SortBar from '../../components/SortBar/SortBar';
import { strings } from '../../locales';
import { MissingPalletWorklistItemI } from '../../models/WorklistItem';
import { CustomModalComponent } from '../Modal/Modal';
import { styles } from './PalletWorklist.style';
import Button from '../../components/buttons/Button';
import COLOR from '../../themes/Color';
import { clearPallet } from '../../state/actions/saga';
import { AsyncState } from '../../models/AsyncState';
import {
  hideActivityModal,
  showActivityModal
} from '../../state/actions/Modal';
import { CLEAR_PALLET } from '../../state/actions/asyncAPI';
import WorklistHeader from '../../components/WorklistHeader/WorklistHeader';

interface PalletWorkListProps {
  palletWorklist: MissingPalletWorklistItemI[] | undefined;
  displayConfirmation: boolean;
  setDisplayConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  dispatch: Dispatch<any>;
  clearPalletAPI: AsyncState;
  navigation: NavigationProp<any>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  onRefresh: () => void;
  refreshing: boolean;
  error: AxiosError | null;
  groupToggle: boolean;
  updateGroupToggle: React.Dispatch<React.SetStateAction<boolean>>;
}
interface ListItemProps {
  item: MissingPalletWorklistItemI;
  handleAddLocationClick: () => void;
  handleDeleteClick: (palletID: string) => void;
  itemActionIdx: number;
  setItemActionBtnIndex: React.Dispatch<React.SetStateAction<number>> | undefined;
  index: number
}

export const clearPalletAPIHook = (
  clearPalletApi: AsyncState,
  palletId: string,
  navigation: NavigationProp<any>,
  dispatch: Dispatch<any>,
  setDisplayConfirmation: React.Dispatch<React.SetStateAction<boolean>>,
  onRefresh: () => void
): void => {
  if (navigation.isFocused()) {
    if (!clearPalletApi.isWaiting) {
      // Success
      if (clearPalletApi.result) {
        dispatch(hideActivityModal());
        setDisplayConfirmation(false);
        dispatch({ type: CLEAR_PALLET.RESET });
        onRefresh();

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

const onPalletCardClick = (
  index: number, setItemActionBtnIndex?: React.Dispatch<React.SetStateAction<number>>
) => {
  if (setItemActionBtnIndex && typeof setItemActionBtnIndex === 'function') {
    setItemActionBtnIndex(index);
  }
};

export const RenderWorklistItem = (props: ListItemProps): JSX.Element => {
  const {
    item, handleAddLocationClick, handleDeleteClick, itemActionIdx, setItemActionBtnIndex, index
  } = props;
  if (item.palletId === 0) {
    const { lastKnownPalletLocationName, itemCount } = item;
    return (
      <WorklistHeader title={lastKnownPalletLocationName} numberOfItems={itemCount || 0} />
    );
  }

  return (
    <MissingPalletWorklistCard
      palletId={item.palletId}
      lastLocation={item.lastKnownPalletLocationName}
      reportedBy={item.createUserId}
      reportedDate={item.createTs}
      expanded={index === itemActionIdx}
      addCallback={handleAddLocationClick}
      deleteCallback={() => handleDeleteClick(item.palletId.toString())}
      navigateCallback={() => onPalletCardClick(index, setItemActionBtnIndex)}
    />
  );
};

export const convertDataToDisplayList = (
  data: MissingPalletWorklistItemI[] | undefined, groupToggle: boolean
): MissingPalletWorklistItemI[] => {
  if (!groupToggle) {
    const workListItems = data && data.length
      ? data.sort((a, b) => a.palletId - b.palletId) : [];
    return [{
      palletId: 0,
      lastKnownPalletLocationId: -1,
      lastKnownPalletLocationName: strings('WORKLIST.ALL'),
      itemCount: workListItems.length,
      createUserId: '',
      createTs: '',
      palletDeleted: false,
      sectionID: 0,
      completed: false
    },
    ...workListItems];
  }

  const sortedData = data || [];
  // first, sort by Loc
  sortedData.sort((firstEl: MissingPalletWorklistItemI, secondEl: MissingPalletWorklistItemI) => {
    if (firstEl.lastKnownPalletLocationName && secondEl.lastKnownPalletLocationName) {
      if (firstEl.lastKnownPalletLocationName < secondEl.lastKnownPalletLocationName) {
        return -1;
      }
      if (firstEl.lastKnownPalletLocationName > secondEl.lastKnownPalletLocationName) {
        return 1;
      }
    }
    return 0;
  });

  // second, sort by section
  let locSecWiseItems: MissingPalletWorklistItemI[] = [];
  let previousLocItem: MissingPalletWorklistItemI;
  let zoneWiseItems: MissingPalletWorklistItemI[] = [];
  sortedData.forEach(item => {
    const currSec = item.lastKnownPalletLocationName.split('-').pop();
    const prevZone = previousLocItem ? previousLocItem.lastKnownPalletLocationName.split('-')[0] : '';
    const currZone = item.lastKnownPalletLocationName.split('-')[0];
    if (!prevZone || (prevZone !== currZone)) {
      if (zoneWiseItems.length) {
        const sortedLocWisePallets = zoneWiseItems.sort((a, b) => (
          a.sectionID && b.sectionID ? a.sectionID - b.sectionID : 0
        ));
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
    const sortedLocWisePallets = zoneWiseItems.sort((a, b) => (
      a.sectionID && b.sectionID ? a.sectionID - b.sectionID : 0
    ));
    locSecWiseItems = locSecWiseItems.concat(sortedLocWisePallets);
  }

  let returnData: MissingPalletWorklistItemI[] = [];

  // Loc than sec than palletid
  let previousItem: MissingPalletWorklistItemI;
  let locWisePallets: MissingPalletWorklistItemI[] = [];
  locSecWiseItems.forEach(item => {
    if (!previousItem || (previousItem.lastKnownPalletLocationId !== item.lastKnownPalletLocationId)) {
      if (locWisePallets.length) {
        returnData[returnData.length - 1].itemCount = locWisePallets.length;
        const sortedLocWisePallets = locWisePallets.sort((a, b) => a.palletId - b.palletId);
        returnData = returnData.concat(sortedLocWisePallets);
      }
      previousItem = item;
      returnData.push({
        palletId: 0,
        lastKnownPalletLocationId: item.lastKnownPalletLocationId,
        lastKnownPalletLocationName: item.lastKnownPalletLocationName,
        createUserId: '',
        createTs: '',
        palletDeleted: false,
        itemCount: 1,
        sectionID: 0,
        completed: false
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

export const PalletWorklist = (props: PalletWorkListProps) => {
  const {
    clearPalletAPI,
    displayConfirmation,
    dispatch,
    palletWorklist,
    setDisplayConfirmation,
    navigation,
    useEffectHook,
    onRefresh,
    refreshing,
    error,
    groupToggle,
    updateGroupToggle
  } = props;
  let deletePalletId = '';

  const [itemActionBtnIndex, setItemActionBtnIndex] = useState(1);
  useEffectHook(
    () => clearPalletAPIHook(
      clearPalletAPI,
      deletePalletId,
      navigation,
      dispatch,
      setDisplayConfirmation,
      onRefresh
    ),
    [clearPalletAPI]
  );

  useEffectHook(() => {
    setItemActionBtnIndex(1);
  }, [groupToggle]);
  // TODO handle request + response for getPalletWorklist service call
  const onDeletePress = () => {
    dispatch(clearPallet({ palletId: deletePalletId }));
  };

  const handleDeleteClick = (palletId: string) => {
    setDisplayConfirmation(true);
    deletePalletId = palletId;
  };

  const handleAddLocationClick = () => navigation.navigate('ScanPallet');

  if (error) {
    return (
      <View style={styles.errorView}>
        <MaterialIcons name="error" size={60} color={COLOR.RED_300} />
        <Text style={styles.errorText}>
          {strings('WORKLIST.WORKLIST_ITEM_API_ERROR')}
        </Text>
        <TouchableOpacity style={styles.errorButton} onPress={onRefresh}>
          <Text>{strings('GENERICS.RETRY')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (refreshing) {
    return (
      <ActivityIndicator
        animating={refreshing}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }

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
      <SortBar
        isGrouped={groupToggle}
        updateGroupToggle={updateGroupToggle}
      />
      <FlatList
        data={convertDataToDisplayList(palletWorklist, groupToggle)}
        keyExtractor={(item: MissingPalletWorklistItemI, index: number) => {
          if (item.palletId === 0) {
            return item.lastKnownPalletLocationName.toString();
          }
          return item.palletId + index.toString();
        }}
        renderItem={({ item, index }) => (
          <RenderWorklistItem
            item={item}
            handleAddLocationClick={handleAddLocationClick}
            handleDeleteClick={() => handleDeleteClick(item.palletId.toString())}
            itemActionIdx={itemActionBtnIndex}
            setItemActionBtnIndex={setItemActionBtnIndex || undefined}
            index={index}
          />
        )}
        onRefresh={onRefresh}
        refreshing={refreshing}
        style={styles.list}
      />
    </View>
  );
};
