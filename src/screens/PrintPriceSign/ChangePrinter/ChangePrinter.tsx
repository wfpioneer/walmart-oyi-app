import React, { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Button from '../../../components/buttons/Button';
import styles from './ChangePrinter.style';
import COLOR from '../../../themes/Color';
import { strings } from '../../../locales';
import { barcodeEmitter } from '../../../utils/scannerUtils';
import { addToPrinterList } from '../../../state/actions/Print';
import { Printer, PrinterType } from '../../../models/Printer';

export const ChangePrinter = () => {
  const [macAddress, updateMacAddress] = useState('');
  const isNavigationFocused = useIsFocused();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Barcode event listener effect
  useEffect(() => {
    const scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (isNavigationFocused) {
        console.log('mac address received scan', scan.value, scan.type);
      }
    });

    return () => {
      scannedSubscription?.remove();
    };
  }, []);

  const submitMacAddress = () => {
    if (macAddress.length === 12) {
      const newPrinter: Printer = {
        type: PrinterType.PORTABLE,
        name: `${strings('PRINT.PORTABLE_PRINTER')} ${macAddress}`,
        desc: '',
        id: parseInt(macAddress, 10)
      };
      dispatch(addToPrinterList(newPrinter));
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textField}
        value={macAddress}
        onChangeText={(text: string) => updateMacAddress(text)}
        selectionColor={COLOR.MAIN_THEME_COLOR}
        placeholder={strings('PRINT.MAC_ADDRESS')}
        onSubmitEditing={submitMacAddress}
        keyboardType="numeric"
      />
      { (macAddress.length > 0 && macAddress.length !== 12)
        && (
        <View style={styles.alertView}>
          <MaterialCommunityIcons name="alert-circle" size={20} color={COLOR.RED_300} />
          <Text style={styles.errorText}>{strings('PRINT.MAC_ADDRESS_ERROR')}</Text>
        </View>
        )
      }
      <Button
        title={strings('GENERICS.SUBMIT')}
        style={styles.button}
        disabled={macAddress.length !== 12}
        onPress={submitMacAddress}
      />
    </View>
  );
};