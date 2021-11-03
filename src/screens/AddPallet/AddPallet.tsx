import React, {EffectCallback, useEffect, useState} from 'react';
import { Text, TextInput, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native'
import Button from '../../components/buttons/Button';
import { trackEvent } from '../../utils/AppCenterTool';
import {useTypedSelector} from '../../state/reducers/RootReducer';
import {setManualScan, setScannedEvent} from '../../state/actions/Global';
import {barcodeEmitter} from "../../utils/scannerUtils";
import {strings} from "../../locales";
import styles from "./AddPallet.style";
import COLOR from "../../themes/Color";

interface AddPalletScreenProps {
  palletId: string;
  updatePalletId: React.Dispatch<React.SetStateAction<string>>;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  useEffectHook: (effect: EffectCallback, deps?:ReadonlyArray<any>) => void;
  section: { id: number; name: string; };
  locationName: string;
}

export const AddPalletScreen = (props: AddPalletScreenProps) => {
  const { palletId, updatePalletId, dispatch, navigation, useEffectHook, section, locationName } = props;

  const palletIDRegex = /^[0-9]+$/;

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
    // TODO add integration to addPallet api once it is complete on the back end and add trackEvent for service call
    if (palletId.match(palletIDRegex)) {
      navigation.goBack()
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
  )
};

const AddPallet = () => {
  const [palletId, updatePalletId] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const zone = useTypedSelector(state => state.Location.selectedZone);
  const aisle = useTypedSelector(state => state.Location.selectedAisle);
  const section = useTypedSelector(state => state.Location.selectedSection);
  const locationName = `${zone.name}${aisle.name}-${section.name}`;
  return (
    <AddPalletScreen
      palletId={palletId}
      updatePalletId={updatePalletId}
      dispatch={dispatch}
      navigation={navigation}
      useEffectHook={useEffect}
      section={section}
      locationName={locationName}
    />
  )
};

export default AddPallet;