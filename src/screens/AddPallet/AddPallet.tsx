import React, { EffectCallback, useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { addPallet, getSectionDetails } from '../../state/actions/saga';
import Button from '../../components/buttons/Button';
import { trackEvent } from '../../utils/AppCenterTool';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { setManualScan, setScannedEvent } from '../../state/actions/Global';
import { barcodeEmitter } from '../../utils/scannerUtils';
import { strings } from '../../locales';
import styles from './AddPallet.style';
import COLOR from '../../themes/Color';
import { AsyncState } from '../../models/AsyncState';
import { LocationType } from '../../models/LocationType';
import { showSnackBar } from '../../state/actions/SnackBar';
import { showInfoModal } from '../../state/actions/Modal';

const COMPLETE_API_409_ERROR = 'Request failed with status code 409';
interface AddPalletScreenProps {
  palletId: string;
  updatePalletId: React.Dispatch<React.SetStateAction<string>>;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  section: { id: string; name: string; };
  locationName: string;
  addAPI: AsyncState;
  error: { error: boolean; message: string };
  setError: React.Dispatch<React.SetStateAction<{ error: boolean; message: string; }>>;
}

export const AddPalletScreen = (props: AddPalletScreenProps): JSX.Element => {
  const {
    palletId,
    updatePalletId,
    dispatch,
    navigation,
    useEffectHook,
    section,
    locationName,
    addAPI,
    setError
  } = props;

  const palletIDRegex = /^[0-9]+$/;
  // Add Location API
  useEffectHook(() => {
    // on api success
    // eslint-disable-next-line no-empty
    if (!addAPI.isWaiting && addAPI.result) {
      dispatch(getSectionDetails({ sectionId: section.id }));
      dispatch(showSnackBar(strings('LOCATION.PALLET_ADDED'), 3000));
      navigation.goBack();
    }

    // on api failure
    if (!addAPI.isWaiting && addAPI.error) {
      if (addAPI.error === COMPLETE_API_409_ERROR) {
        dispatch(showInfoModal(strings('LOCATION.PALLET_ERROR'), strings('LOCATION.PALLET_NOT_FOUND')));
      } else {
        dispatch(showInfoModal(strings('LOCATION.ADD_PALLET_ERROR'), strings('LOCATION.ADD_PALLET_API_ERROR')));
      }
    }

    // on api submission
    if (addAPI.isWaiting) {
      setError({ error: false, message: '' });
    }
  }, [addAPI]);
  // Navigation Listener
  useEffectHook(() => {
    // Resets location api response data when navigating off-screen
    navigation.addListener('beforeRemove', () => {
      dispatch({ type: 'API/ADD_PALLET/RESET' });
    });
  }, []);
  // Barcode event listener effect
  useEffectHook(() => {
    const scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        dispatch(setScannedEvent(scan));
        dispatch(setManualScan(false));
        updatePalletId(scan.value);
      }
    });

    return () => {
      scannedSubscription.remove();
      return undefined;
    };
  }, []);

  const submitPalletId = () => {
    if (palletId.match(palletIDRegex)) {
      dispatch(addPallet({
        palletId,
        sectionId: section.id
      }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>
        {`${strings('LOCATION.SECTION')} ${locationName}`}
      </Text>
      <TextInput
        style={styles.textField}
        value={palletId}
        onChangeText={(text: string) => updatePalletId(text)}
        selectionColor={COLOR.MAIN_THEME_COLOR}
        placeholder={strings('LOCATION.PALLET_PLACEHOLDER')}
        onSubmitEditing={submitPalletId}
        keyboardType="numeric"
      />
      { (palletId.length > 0 && !palletId.match(palletIDRegex))
        && (
          <View style={styles.alertView}>
            <MaterialCommunityIcons name="alert-circle" size={20} color={COLOR.RED_300} />
            <Text style={styles.errorText}>{strings('LOCATION.PALLET_VALIDATE_ERROR')}</Text>
          </View>
        )}
      <Button
        title={strings('GENERICS.SUBMIT')}
        style={styles.button}
        disabled={!palletId.match(palletIDRegex)}
        onPress={submitPalletId}
      />
    </View>
  );
};

const AddPallet = (): JSX.Element => {
  const [palletId, updatePalletId] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const zone = useTypedSelector(state => state.Location.selectedZone);
  const aisle = useTypedSelector(state => state.Location.selectedAisle);
  const section = useTypedSelector(state => state.Location.selectedSection);
  const locationName = `${zone.name}${aisle.name}-${section.name}`;
  const addAPI = useTypedSelector(state => state.async.addPallet);
  const [error, setError] = useState({ error: false, message: '' });
  return (
    <AddPalletScreen
      palletId={palletId}
      updatePalletId={updatePalletId}
      dispatch={dispatch}
      navigation={navigation}
      useEffectHook={useEffect}
      section={section}
      locationName={locationName}
      addAPI={addAPI}
      setError={setError}
      error={error}
    />
  );
};

export default AddPallet;
