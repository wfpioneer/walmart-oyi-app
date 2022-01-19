import React from 'react';
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import { openCamera } from '../../utils/scannerUtils';
import styles from './CombinePallets.style';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { CombinePallet, PalletItem } from '../../models/PalletManagementTypes';
import Button from '../../components/buttons/Button';
import LocationManualScan from '../../components/LocationManualScan/LocationManualScan';

interface CombinePalletsProps {
  combinePallets: CombinePallet[];
  palletId: number;
  palletItems: PalletItem[];
  isManualScanEnabled: boolean;
}
const PalletCard = ({ item }: { item: CombinePallet }) => (
  <View
    style={{
      justifyContent: 'flex-start',
      flexDirection: 'row',
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderBottomWidth: 2,
      borderBottomColor: COLOR.GREY_600
    }}
  >
    <View>
      <Text style={styles.palletText}>
        {strings('PALLET.PALLET_ID')}: {item.palletId}
      </Text>
      <Text style={styles.itemText}>
        {strings('GENERICS.ITEMS')}: {item.itemCount}
      </Text>
    </View>
  </View>
);

const ScanPalletComponent = (): JSX.Element => (
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
export const CombinePalletsScreen = (
  props: CombinePalletsProps
): JSX.Element => {
  const { combinePallets, palletId, palletItems, isManualScanEnabled } = props;
  // Make this a generic Button as it will be used in multiple screens
  return (
    <View style={styles.container}>
      {combinePallets.length !== 0 ? (
        <>
          {isManualScanEnabled && <LocationManualScan />}
          <FlatList
            data={combinePallets}
            renderItem={PalletCard}
            keyExtractor={(item: CombinePallet) => item.palletId.toString()}
          />
          <View style={styles.palletContainer}>
            <Text style={styles.mergeText}>will be merged into</Text>
            <View style={styles.palletInfoHeader}>
              <Text style={styles.palletText}>
                {strings('LOCATION.PALLET')}: {palletId}
              </Text>
              <Text style={styles.itemText}>
                {strings('GENERICS.ITEMS')}: {palletItems.length}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={strings('GENERICS.SAVE')}
                type={Button.Type.PRIMARY}
                style={{ width: '90%' }}
                onPress={() => console.log('Combine Pallets Save')}
              />
            </View>
          </View>
        </>
      ) : (
        <ScanPalletComponent />
      )}
    </View>
  );
};
const CombinePallets = (): JSX.Element => {
  const { combinePallets, palletInfo, items } = useTypedSelector(
    state => state.PalletManagement
  );
  const isManualScanEnabled = useTypedSelector(
    state => state.Global.isManualScanEnabled
  );
  return (
    <CombinePalletsScreen
      combinePallets={combinePallets}
      palletId={palletInfo.id}
      palletItems={items}
      isManualScanEnabled={isManualScanEnabled}
    />
  );
};

export default CombinePallets;
