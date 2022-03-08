import React from 'react';
import {
  FlatList, Pressable, Text, View
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { head } from 'lodash';
import COLOR from '../../themes/Color';
import { strings } from '../../locales';
import { BinningPallet } from '../../models/Binning';
import styles from './AssignLocation.style';
import { openCamera } from '../../utils/scannerUtils';
import ManualScanComponent from '../../components/manualscan/ManualScan';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import BinningItemCard from '../../components/BinningItemCard/BinningItemCard';

interface AssignLocationProps {
  palletsToBin: BinningPallet[];
  isManualScanEnabled: boolean;
}
const ItemSeparator = () => <View style={styles.separator} />;

export const binningItemCardReadOnly = (
  { item }: { item: BinningPallet },
) => {
  const firstItem = head(item.items);
  return (
    <BinningItemCard
      palletId={item.id}
      itemDesc={firstItem ? firstItem.itemDesc : ''}
      lastLocation={item.lastLocation}
    />
  );
};

export const AssignLocationScreen = (props: AssignLocationProps): JSX.Element => {
  const { isManualScanEnabled, palletsToBin } = props;

  const scanTextView = () => (
    <View style={styles.scanView}>
      {/* TODO make dev only? */}
      <Pressable onPress={() => openCamera()}>
        <MaterialCommunityIcon
          name="barcode-scan"
          size={70}
          color={COLOR.MAIN_THEME_COLOR}
        />
      </Pressable>
      <Text style={styles.scanText}>
        {palletsToBin.length === 1
          ? strings('BINNING.SCAN_LOCATION')
          : strings('BINNING.SCAN_LOCATION_PLURAL')}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {isManualScanEnabled && <ManualScanComponent placeholder={strings('LOCATION.MANUAL_ENTRY_BUTTON')} />}
      <FlatList
        data={palletsToBin}
        renderItem={item => binningItemCardReadOnly(item)}
        removeClippedSubviews={false}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={(item, index) => `${item.id}-${index}`}
      />
      {scanTextView()}
    </View>
  );
};

const AssignLocation = (): JSX.Element => {
  const isManualScanEnabled = useTypedSelector(state => state.Global.isManualScanEnabled);
  const palletsToBin = useTypedSelector(state => state.Binning.pallets);

  return (
    <AssignLocationScreen
      palletsToBin={palletsToBin}
      isManualScanEnabled={isManualScanEnabled}
    />
  );
};

export default AssignLocation;
