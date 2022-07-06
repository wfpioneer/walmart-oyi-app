import React, {
  Dispatch, EffectCallback, useEffect, useState
} from 'react';
import { FlatList, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
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

interface PalletWorkListProps {
  palletWorklist: MissingPalletWorklistItemI[];
  displayConfirmation: boolean;
  setDisplayConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  dispatch: Dispatch<any>;
  clearPalletAPI: AsyncState;
  navigation: NavigationProp<any>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
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
      <FlatList
        data={palletWorklist}
        keyExtractor={(item: MissingPalletWorklistItemI, index: number) => item.palletId + index.toString()}
        renderItem={({ item }) => (
          <MissingPalletWorklistCard
            palletId={item.palletId}
            lastLocation={item.lastKnownLocationName}
            reportedBy={item.createId}
            reportedDate={item.createTS}
            expanded={true} // TODO Toggle for a single Pallet WorkList Item
            addCallback={handleAddLocationClick}
            deleteCallback={() => handleDeleteClick(item.palletId.toString())}
            navigateCallback={() => {}}
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
  const mockMPWorklist: MissingPalletWorklistItemI[] = [
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
      completedTS: undefined
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
