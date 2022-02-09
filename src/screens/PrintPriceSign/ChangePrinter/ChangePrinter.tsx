import React, { EffectCallback, useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import Button from '../../../components/buttons/Button';
import styles from './ChangePrinter.style';
import COLOR from '../../../themes/Color';
import { strings } from '../../../locales';
import { barcodeEmitter } from '../../../utils/scannerUtils';
import { addToPrinterList } from '../../../state/actions/Print';
import { Printer, PrinterType } from '../../../models/Printer';
import { setManualScan, setScannedEvent } from '../../../state/actions/Global';
import { trackEvent } from '../../../utils/AppCenterTool';
import { useTypedSelector } from '../../../state/reducers/RootReducer';
import {
  savePrinter,
  setLocationLabelPrinter,
  setPalletLabelPrinter,
  setPriceLabelPrinter
} from '../../../utils/asyncStorageUtils';

interface ChangePrinterProps {
  macAddress: string;
  updateMacAddress: React.Dispatch<React.SetStateAction<string>>;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  trackEventCall: (eventName: string, params?: any) => void;
  printers: Printer[];
  printingLocationLabels: string;
  printingPalletLabel: boolean;
}

export const submitMacAddress = (
  macAddress: string,
  trackEventCall:(eventName: string, params?: any) => void,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  printingPalletLabel: boolean,
  printingLocationLabels: string
): void => {
  if (macAddress.length === 12) {
    const newPrinter: Printer = {
      type: PrinterType.PORTABLE,
      name: `${strings('PRINT.PORTABLE_PRINTER')} ${macAddress}`,
      desc: '',
      id: macAddress
    };
    trackEventCall('add_to_printer_list', {
      newPrinter: JSON.stringify(newPrinter)
    });
    dispatch(addToPrinterList(newPrinter));
    savePrinter(newPrinter);

    if (printingPalletLabel) {
      setPalletLabelPrinter(newPrinter);
    } else if (printingLocationLabels !== '') {
      setLocationLabelPrinter(newPrinter);
    } else {
      setPriceLabelPrinter(newPrinter);
    }
    navigation.goBack();
  }
};

export const isPrinterExists = (printers: Printer[], macAddress: string): boolean => printers.length > 0
  && printers.some(print => print.id === macAddress);

export const ChangePrinterScreen = (props: ChangePrinterProps): JSX.Element => {
  const {
    macAddress,
    updateMacAddress,
    dispatch,
    navigation,
    useEffectHook,
    trackEventCall,
    printers,
    printingLocationLabels,
    printingPalletLabel
  } = props;
  const macRegex = /^[0-9a-fA-F]{12}/;

  // Barcode event listener effect
  useEffectHook(() => {
    const scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        dispatch(setScannedEvent(scan));
        dispatch(setManualScan(false));
        updateMacAddress(scan.value);
      }
    });

    return () => {
      scannedSubscription.remove();
      return undefined;
    };
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textField}
        value={macAddress}
        onChangeText={(text: string) => updateMacAddress(text)}
        selectionColor={COLOR.MAIN_THEME_COLOR}
        placeholder={strings('PRINT.MAC_ADDRESS')}
        onSubmitEditing={() => submitMacAddress(
          macAddress, trackEventCall, dispatch, navigation, printingPalletLabel, printingLocationLabels
        )}
      />
      {macAddress.length > 0 && macAddress.length !== 12 && (
        <View style={styles.alertView}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={20}
            color={COLOR.RED_300}
          />
          <Text style={styles.errorText}>
            {strings('PRINT.MAC_ADDRESS_ERROR')}
          </Text>
        </View>
      )}
      {isPrinterExists(printers, macAddress) && (
        <View style={styles.alertView}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={20}
            color={COLOR.RED_300}
          />
          <Text style={styles.errorText}>
            {strings('PRINT.DUPLICATE_PRINTER')}
          </Text>
        </View>
      )}
      <Button
        title={strings('GENERICS.SUBMIT')}
        style={styles.button}
        disabled={!macAddress.match(macRegex) || isPrinterExists(printers, macAddress)}
        onPress={submitMacAddress}
      />
    </View>
  );
};

export const ChangePrinter = (): JSX.Element => {
  const [macAddress, updateMacAddress] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { printerList, printingLocationLabels, printingPalletLabel } = useTypedSelector(state => state.Print);
  return (
    <ChangePrinterScreen
      macAddress={macAddress}
      updateMacAddress={updateMacAddress}
      dispatch={dispatch}
      navigation={navigation}
      useEffectHook={useEffect}
      trackEventCall={trackEvent}
      printers={printerList}
      printingLocationLabels={printingLocationLabels}
      printingPalletLabel={printingPalletLabel}
    />
  );
};
