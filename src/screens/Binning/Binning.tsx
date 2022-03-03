import React, { useEffect } from 'react';
import {
  Text, TouchableOpacity, View
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { openCamera } from '../../utils/scannerUtils';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import styles from './Binning.style';
import Button from '../../components/buttons/Button';
import ManualScan from '../../components/manualscan/ManualScan';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { BinningPallet } from '../../models/Binning';
import { addPallet, clearPallets, deletePallet } from '../../state/actions/Binning';
import BinningItemCard from '../../components/BinningItemCard/BinningItemCard';

export interface BinningScreenProps {
  pallets: BinningPallet[];
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  isManualScanEnabled: boolean;
}

// TODO: This component has to designed as part of INTLSAOPS-5163
export const binningItemCard = ({ item }: { item: BinningPallet }, dispatch: Dispatch<any>) => (
  <BinningItemCard
    palletId={item.id}
    itemDesc={item.firstItem.itemDesc}
    lastLocation={item.lastLocation}
    onDelete={() => { dispatch(deletePallet(item.id)) }}
  />
);

const ItemSeparator = () => <View style={styles.separator} />;

export const BinningScreen = (props: BinningScreenProps): JSX.Element => {
  const {
    pallets, isManualScanEnabled, dispatch, navigation
  } = props;

  return (
    <View style={styles.container}>
      {isManualScanEnabled && <ManualScan />}
      <Text style={styles.helperText}>{strings('BINNING.SCAN_PALLET_BIN')}</Text>
      <ItemSeparator />
      <FlatList
        data={pallets}
        removeClippedSubviews={false}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={item => binningItemCard(item, dispatch)}
        keyExtractor={(item: any) => item.id.toString()}
        ListEmptyComponent={(
          <View style={styles.scanContainer}>
            <TouchableOpacity onPress={() => openCamera()}>
              <Icon size={100} name="barcode-scan" color={COLOR.BLACK} />
            </TouchableOpacity>
            <View style={styles.scanText}>
              <Text>{strings('BINNING.SCAN_PALLET')}</Text>
            </View>
          </View>
        )}
      />
      <ItemSeparator />
      <Button
        title={strings('GENERICS.NEXT')}
        type={Button.Type.PRIMARY}
        style={styles.buttonWrapper}
        disabled={pallets.length < 1}
      />
    </View>
  );
};
const Binning = (): JSX.Element => {
  // TODO: pallets and binLocation needs to be connected to Redux
  const pallets = useTypedSelector(state => state.Binning.pallets);
  const binLocation = useTypedSelector(state => state.Binning.binLocation);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isManualScanEnabled = useTypedSelector(state => state.Global.isManualScanEnabled);

  useEffect(() => {
    dispatch(clearPallets());
    dispatch(addPallet({
      id: 123456,
      expirationDate: '03/22/2022',
      lastLocation: 'ABAR1-5',
      firstItem: {
        itemNbr: 1234,
        upcNbr: '123456789098',
        price: 10,
        quantity: 100,
        itemDesc: 'test'
      }
    }));
    dispatch(addPallet({
      id: 123457,
      expirationDate: '03/22/2022',
      firstItem: {
        itemNbr: 1234,
        upcNbr: '123456789098',
        price: 10,
        quantity: 100,
        itemDesc: 'test'
      }
    }));
    dispatch(addPallet({
      id: 123458,
      expirationDate: '03/22/2022',
      lastLocation: 'ABAR1-5',
      firstItem: {
        itemNbr: 1234,
        upcNbr: '123456789098',
        price: 10,
        quantity: 100,
        itemDesc: 'test'
      }
    }));
  }, []);

  return (
    <BinningScreen
      pallets={pallets}
      dispatch={dispatch}
      navigation={navigation}
      isManualScanEnabled={isManualScanEnabled}
    />
  );
};

export default Binning;
