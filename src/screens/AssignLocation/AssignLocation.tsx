import React from 'react';
import { FlatList, Text, View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLOR from '../../themes/Color';
import { strings } from '../../locales';
import { PalletInfo } from '../../models/PalletManagementTypes';
import styles from './AssignLocation.style';
import Button from '../../components/buttons/Button';

interface AssignLocationProps {
  palletsToBin: any[]
}

export const AssignLocationScreen = (props: AssignLocationProps): JSX.Element => {
  const { palletsToBin } = props;

  // TODO Replace with binning pallet card
  const renderItem = ({ item }: { item: PalletInfo }) => (
    <View style={{ borderWidth: 1, borderRadius: 3, borderColor: 'black' }}>
      <Text>{item.id}</Text>
    </View>
  );

  const scanTextView = () => (
    <View style={styles.scanView}>
      <MaterialCommunityIcon
        name="barcode-scan"
        size={70}
        color={COLOR.MAIN_THEME_COLOR}
      />
      <Text style={styles.scanText}>
        {palletsToBin.length === 1
          ? strings('BINNING.SCAN_LOCATION')
          : strings('BINNING.SCAN_LOCATION_PLURAL')}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={palletsToBin}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
      />
      {scanTextView()}
    </View>
  );
};

const AssignLocation = (): JSX.Element => {
  // TODO get pallets from redux
  const palletsToBin: PalletInfo[] = [
    {
      id: 64
    },
    {
      id: 643
    }
  ];
  return (
    <AssignLocationScreen
      palletsToBin={palletsToBin}
    />
  );
};

export default AssignLocation;
