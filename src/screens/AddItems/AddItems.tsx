import React, { EffectCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  View
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { trackEvent } from 'appcenter-analytics';
import moment from 'moment';
import { addLocation, addPallet, getSectionDetails } from '../../state/actions/saga';
import Button from '../../components/buttons/Button';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { setManualScan, setScannedEvent } from '../../state/actions/Global';
import { barcodeEmitter } from '../../utils/scannerUtils';
import { strings } from '../../locales';
import styles from './AddItems.style';
import COLOR from '../../themes/Color';
import { AsyncState } from '../../models/AsyncState';
import { showSnackBar } from '../../state/actions/SnackBar';
import { hideActivityModal, showInfoModal } from '../../state/actions/Modal';
import { SALES_FLOOR_LOCATION_TYPE } from '../SelectLocationType/SelectLocationType';
import { SNACKBAR_TIMEOUT } from '../../utils/global';

interface AddItemsScreenProps {
  upc: string;
  updateUPC: React.Dispatch<React.SetStateAction<string>>;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  section: { id: number | string; name: string; };
  addAPI: AsyncState;
  createItemsToSectionApiStart: number;
  setcreateItemsToSectionApiStart: React.Dispatch<React.SetStateAction<number>>
}

export const AddItemsScreen = (props: AddItemsScreenProps): JSX.Element => {
  const {
    upc,
    updateUPC,
    dispatch,
    navigation,
    useEffectHook,
    section,
    addAPI,
    createItemsToSectionApiStart,
    setcreateItemsToSectionApiStart
  } = props;

  const itemIDRegex = /^[0-9]+$/;
  if (addAPI.isWaiting) {
    return (
      <ActivityIndicator
        animating={addAPI.isWaiting}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.completeActivityIndicator}
      />
    );
  }
  // Add Location API
  useEffectHook(() => {
    // on api success
    // eslint-disable-next-line no-empty
    if (!addAPI.isWaiting && addAPI.result) {
      props.dispatch(hideActivityModal());
      trackEvent('create_items_to_section_success', { duration: moment().valueOf() - createItemsToSectionApiStart });
      dispatch(getSectionDetails({ sectionId: section.id.toString() }));
      dispatch(showSnackBar(strings('LOCATION.ITEM_ADDED'), SNACKBAR_TIMEOUT));
      navigation.goBack();
    }

    // on api failure
    if (!addAPI.isWaiting && addAPI.error) {
      props.dispatch(hideActivityModal());
      trackEvent(
        'create_items_to_section_failure',
        {
          errorDetails: addAPI.error.message || addAPI.error,
          duration: moment().valueOf() - createItemsToSectionApiStart
        }
      );
      dispatch(showInfoModal(strings('LOCATION.ADD_ITEM_ERROR'), strings('LOCATION.ADD_ITEM_API_ERROR')));
    }
  }, [addAPI]);
  // Navigation Listener
  useEffectHook(() => {
    // Resets location api response data when navigating off-screen
    navigation.addListener('beforeRemove', () => {
      dispatch({ type: 'API/ADD_LOCATION/RESET' });
    });
  }, []);
  // Barcode event listener effect
  useEffectHook(() => {
    const scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        dispatch(setScannedEvent(scan));
        dispatch(setManualScan(false));
        updateUPC(scan.value);
      }
    });

    return () => {
      scannedSubscription.remove();
      return undefined;
    };
  }, []);

  const submitUpc = () => {
    if (upc.match(itemIDRegex)) {
      setcreateItemsToSectionApiStart(moment().valueOf());
      dispatch(addLocation({
        upc,
        sectionId: section.id,
        locationTypeNbr: SALES_FLOOR_LOCATION_TYPE
      }));
    }
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textField}
        value={upc}
        onChangeText={(text: string) => updateUPC(text)}
        selectionColor={COLOR.MAIN_THEME_COLOR}
        placeholder={strings('GENERICS.ENTER_UPC_ITEM_NBR')}
        onSubmitEditing={submitUpc}
        keyboardType="numeric"
      />
      { (upc.length > 0 && !upc.match(itemIDRegex))
        && (
          <View style={styles.alertView}>
            <MaterialCommunityIcons name="alert-circle" size={20} color={COLOR.RED_300} />
            <Text style={styles.errorText}>{strings('LOCATION.UPC_VALIDATE_ERROR')}</Text>
          </View>
        )}
      <Button
        title={strings('GENERICS.SUBMIT')}
        style={styles.button}
        disabled={!upc.match(itemIDRegex)}
        onPress={submitUpc}
      />
    </View>
  );
};

const AddItems = (): JSX.Element => {
  const [upc, updateUPC] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const section = useTypedSelector(state => state.Location.selectedSection);
  const addAPI = useTypedSelector(state => state.async.addLocation);
  const [createItemsToSectionApiStart, setcreateItemsToSectionApiStart] = useState(0);
  return (
    <AddItemsScreen
      upc={upc}
      updateUPC={updateUPC}
      dispatch={dispatch}
      navigation={navigation}
      useEffectHook={useEffect}
      section={section}
      addAPI={addAPI}
      createItemsToSectionApiStart={createItemsToSectionApiStart}
      setcreateItemsToSectionApiStart={setcreateItemsToSectionApiStart}
    />
  );
};

export default AddItems;
