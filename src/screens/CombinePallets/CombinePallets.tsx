import React from 'react';
import {
  Text, TextInput, TouchableOpacity, View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import { openCamera } from '../../utils/scannerUtils';
import styles from './CombinePallets.style';

export const CombinePalletsScreen = (props: any): JSX.Element => (
  <View style={styles.scanContainer}>
    <TouchableOpacity onPress={() => openCamera()}>
      <Icon size={100} name="barcode-scan" color={COLOR.BLACK} />
    </TouchableOpacity>
    <View style={styles.scanText}>
      <Text>{strings('PALLET.SCAN_PALLET')}</Text>
    </View>
    <View style={styles.orText}>
      <Text>{strings('GENERICS.OR')}</Text>
    </View>
    <View style={styles.textView}>
      <TextInput
        value=""
        onChangeText={(text: string) => console.log('Setting Text')/* setSearchText(text.replace(nonNumRegex, '')) */}
        style={styles.textInput}
        keyboardType="numeric"
        placeholder={strings('PALLET.ENTER_PALLET_ID')}
        onSubmitEditing={() => console.log('Scanning a pallet Id')}
      />
    </View>
  </View>
);
const CombinePallets = (): JSX.Element => <CombinePalletsScreen />;

export default CombinePallets;
