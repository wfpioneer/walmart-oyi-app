import React from 'react';
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

export interface BinningScreenProps {
  pallets: Pallet[] | [];
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  isManualScanEnabled: boolean;
}
export interface Pallet {
  palletId: number,
  expirationDate: string,
  lastLocation?: string,
  firstItem: {
    itemDesc: string,
    price: number,
    upcNbr: string,
    quantity: number
  }
}

// TODO: This component has to designed as part of INTLSAOPS-5163
export const binningItemCard = ({ item }: { item: Pallet }): JSX.Element => (
  <View>
    <View>
      <Text>{`Id: ${item.palletId}`}</Text>
      <Text>{`Last Loc: ${item?.lastLocation}`}</Text>
    </View>
    <View>
      <Text>{`First Item: ${item.firstItem.itemDesc}`}</Text>
      <TouchableOpacity style={styles.icon}>
        <View>
          <Icon name="trash-can" size={20} color={COLOR.TRACKER_GREY} />
        </View>
      </TouchableOpacity>
    </View>
  </View>
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
        renderItem={binningItemCard}
        keyExtractor={(item: any) => item.palletId.toString()}
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
  const pallets: Pallet[] = [{
    palletId: 123456,
    expirationDate: '10-3-2022',
    firstItem: {
      itemDesc: 'itemDesc',
      price: 123,
      upcNbr: '12343534',
      quantity: 2
    }
  }, {
    palletId: 345345,
    expirationDate: '10-3-2022',
    firstItem: {
      itemDesc: 'itemDesc',
      price: 123,
      upcNbr: '345345',
      quantity: 2
    }
  }, {
    palletId: 345344,
    expirationDate: '10-3-2022',
    firstItem: {
      itemDesc: 'itemDesc',
      price: 123,
      upcNbr: '345345',
      quantity: 2
    }
  }, {
    palletId: 435653,
    expirationDate: '10-3-2022',
    firstItem: {
      itemDesc: 'itemDesc',
      price: 123,
      upcNbr: '345345',
      quantity: 2
    }
  }, {
    palletId: 345354,
    expirationDate: '10-3-2022',
    firstItem: {
      itemDesc: 'itemDesc',
      price: 123,
      upcNbr: '345345',
      quantity: 2
    }
  }];
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isManualScanEnabled = useTypedSelector(state => state.Global.isManualScanEnabled);

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
