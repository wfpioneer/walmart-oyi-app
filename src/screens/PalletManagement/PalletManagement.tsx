import React, { EffectCallback, useEffect, useState } from 'react';
import { TouchableOpacity, TextInput, View, EmitterSubscription, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLOR from '../../themes/Color';
import styles from './PalletManagement.style';
import { strings } from '../../locales';
import { barcodeEmitter, openCamera } from '../../utils/scannerUtils';

interface PalletManagementProps {
    useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
    searchText: string;
    setSearchText: React.Dispatch<React.SetStateAction<string>>;
}

export const PalletManagementScreen = (props: PalletManagementProps): JSX.Element => {
  const { useEffectHook, searchText, setSearchText } = props;
  let scannedSubscription: EmitterSubscription;
  // Scanner listener
  useEffectHook(() => {
    scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      setSearchText(scan.value);
    });
    return () => {
      scannedSubscription.remove();
    };
  }, []);
  return (
    <View style={styles.scanContainer}>
      <TouchableOpacity onPress={() => openCamera()}>
        <Icon size={100} name="barcode-scan" color={COLOR.BLACK} />
      </TouchableOpacity>
      <View style={styles.scanText} >
        <Text>{strings('PALLET.SCAN_PALLET')}</Text>
      </View>
      <View style={styles.orText}>
        <Text>{strings('GENERICS.OR')}</Text>
      </View>
      <View style={styles.textView}>
        <TextInput
          value={searchText}
          style={styles.textInput}
          keyboardType="numeric"
          placeholder={strings('PALLET.ENTER_PALLET_ID')}
        />
      </View>
    </View>
  );
};

const PalletManagement = (): JSX.Element => {
  const [searchText, setSearchText] = useState('');
  return (
    <PalletManagementScreen
      useEffectHook={useEffect}
      searchText={searchText}
      setSearchText={setSearchText}
    />
  );
};

export default PalletManagement;
