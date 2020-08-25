import React, { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from '@react-navigation/native';
import Button from '../../../components/buttons/Button';
import styles from './ChangePrinter.style';
import COLOR from '../../../themes/Color';
import { strings } from '../../../locales';
import { barcodeEmitter } from '../../../utils/scannerUtils';

export const ChangePrinter = () => {
  const [macAddress, updateMacAddress] = useState('');
  const isNavigationFocused = useIsFocused();

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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textField}
        value={macAddress}
        onChangeText={(text: string) => updateMacAddress(text)}
        selectionColor={COLOR.MAIN_THEME_COLOR}
        placeholder={strings('PRINT.MAC_ADDRESS')}
        onSubmitEditing={() => {}}
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
      <Button title={strings('GENERICS.SUBMIT')} style={styles.button} disabled={macAddress.length !== 12} />
    </View>
  );
};
