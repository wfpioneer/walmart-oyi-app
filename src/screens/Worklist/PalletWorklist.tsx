import React, { Dispatch, EffectCallback } from 'react';
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
    error
  } = props;
  let deletePalletId = '';

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
      <FlatList
        data={palletWorklist}
        keyExtractor={(item: MissingPalletWorklistItemI, index: number) => item.palletId + index.toString()}
        renderItem={({ item, index }) => (
          <MissingPalletWorklistCard
            palletId={item.palletId}
            lastLocation={item.lastKnownPalletLocationName}
            reportedBy={item.createUserId}
            reportedDate={item.createTs}
            expanded={index === 0} // TODO Toggle for a single Pallet WorkList Item
            addCallback={handleAddLocationClick}
            deleteCallback={() => handleDeleteClick(item.palletId.toString())}
            navigateCallback={() => {}}
          />
        )}
        onRefresh={onRefresh}
        refreshing={refreshing}
        style={styles.list}
      />
    </View>
  );
};
