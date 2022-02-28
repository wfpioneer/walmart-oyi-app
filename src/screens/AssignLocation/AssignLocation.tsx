import React from 'react';
import { FlatList, Text, View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLOR from '../../themes/Color';
import { strings } from '../../locales';
import { PalletInfo } from '../../models/PalletManagementTypes';

interface AssignLocationProps {
  palletsToBin: any[]
}

export const AssignLocationScreen = (props: AssignLocationProps): JSX.Element => {
  const { palletsToBin } = props;

  const renderItem = ({ item }: { item: PalletInfo }) => (
    <View>
      <Text>{item.id}</Text>
    </View>
  );

  const scanTextView = () => (
    <View>
      <MaterialCommunityIcon
        name="barcode-scan"
        size={40}
        color={COLOR.MAIN_THEME_COLOR}
      />
      <Text>
        {palletsToBin.length === 1
          ? strings('BINNING.SCAN_LOCATION')
          : strings('BINNING.SCAN_LOCATION_PLURAL')}
      </Text>
    </View>
  );

  return (
    <>
      <FlatList
        data={palletsToBin}
        renderItem={renderItem}
      />
      {scanTextView()}
    </>
  );
};

const AssignLocation = (): JSX.Element => {
  const palletsToBin: any[] = [];
  return (
    <AssignLocationScreen
      palletsToBin={palletsToBin}
    />
  );
};

export default AssignLocation;
