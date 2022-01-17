import React from 'react';
import { Text, View } from 'react-native';
import styles from './ManagePallet.style';
import { PalletInfo, PalletItems } from '../../models/PalletItem';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { strings } from '../../locales';

interface ManagePalletProps {
  palletInfo: PalletInfo;
  palletItems: PalletItems[];
}
type PalletHeader = {
  palletInfo: PalletInfo;
  palletItems: PalletItems[];
}
const PalletHeader = (props: PalletHeader): JSX.Element => {
  const { palletInfo, palletItems } = props;
  return (
    <View style={styles.headerContainer}>
      <View>
        <Text style={styles.headerText}>{strings('PALLET.PALLET_ID')}</Text>
        <Text style={styles.detailsText}>{palletInfo.id}</Text>
      </View>
      <View>
        <Text style={styles.headerText}>{strings('PALLET.EXPIRATION')}</Text>
        <Text style={styles.detailsText}>{palletInfo.expirationDate}</Text>
      </View>
      <View>
        <Text style={styles.headerText}>{strings('GENERICS.ITEMS')}</Text>
        <Text style={styles.detailsText}>{palletItems.length}</Text>
      </View>
    </View>
  );
};
export const ManagePalletScreen = (props: ManagePalletProps): JSX.Element => {
  const { palletInfo, palletItems } = props;
  return (
    <View>
      <PalletHeader palletInfo={palletInfo} palletItems={palletItems} />
    </View>
  );
};
export const ManagePallet = (): JSX.Element => {
  const { palletInfo, items } = useTypedSelector(
    state => state.PalletManagement
  );
  return <ManagePalletScreen palletInfo={palletInfo} palletItems={items} />;
};
