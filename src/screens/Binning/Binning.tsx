import React, { EffectCallback, useEffect } from 'react';
import {
  EmitterSubscription, Keyboard, KeyboardAvoidingView, Text, TouchableOpacity, View
} from 'react-native';
import { head, omit } from 'lodash';
import { trackEvent } from 'appcenter-analytics';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import Toast from 'react-native-toast-message';
import {
  NavigationProp, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { barcodeEmitter, openCamera } from '../../utils/scannerUtils';
import { validateSession } from '../../utils/sessionTimeout';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import styles from './Binning.style';
import Button from '../../components/buttons/Button';
import ManualScan from '../../components/manualscan/ManualScan';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import {
  getPalletInfo
} from '../../state/actions/saga';
import {
  GET_PALLET_INFO
} from '../../state/actions/asyncAPI';
import { AsyncState } from '../../models/AsyncState';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { BinningItem, BinningPallet } from '../../models/Binning';
import { PalletItem } from '../../models/PalletItem';
import { addPallet } from '../../state/actions/Binning';
import { BinningPallet } from '../../models/Binning';
import { addPallet, clearPallets, deletePallet } from '../../state/actions/Binning';
import BinningItemCard from '../../components/BinningItemCard/BinningItemCard';

export interface BinningScreenProps {
  scannedPallets: BinningPallet[] | [];
  route: RouteProp<any, string>;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  isManualScanEnabled: boolean;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  getPalletApi: AsyncState
}

interface PalletInfo {
  id: number;
  createDate?: string;
  expirationDate?: string;
  items: PalletItem[] | []
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

export const mapBinningPalletItem = (pallet: PalletInfo) => {
  const firstItem = head(pallet.items) as BinningItem;
  const updatedPallet = omit(pallet, 'items');
  return {
    ...updatedPallet,
    firstItem
  } as BinningPallet;
};

const ItemSeparator = () => <View style={styles.separator} />;

export const BinningScreen = (props: BinningScreenProps): JSX.Element => {
  const {
    scannedPallets, isManualScanEnabled, dispatch, navigation, route, useEffectHook, getPalletApi
  } = props;

  const palletExistForBinnning = scannedPallets.length > 0;

  let scannedSubscription: EmitterSubscription;

  // Clear API state before leaving this screen
  useEffectHook(() => navigation.addListener('beforeRemove', () => {
    // TODO: we have to add warning Modal as part of INTLSAOPS-5166
    dispatch({ type: GET_PALLET_INFO.RESET });
  }), []);

  // Scanner listener
  useEffectHook(() => {
    scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        validateSession(navigation, route.name).then(() => {
          trackEvent('pallet_scanned', {
            barcode: scan.value,
            type: scan.type
          });
          dispatch(getPalletInfo({ palletId: scan.value }));
        });
      }
    });
    return () => {
      scannedSubscription.remove();
    };
  }, []);

  useEffectHook(() => {
    // on api success
    if (!getPalletApi.isWaiting && getPalletApi.result) {
      if (getPalletApi.result.status === 200) {
        const {
          pallets
        } = getPalletApi.result.data;
        const newPallet = head(pallets) as PalletInfo;
        const alreadyScannedpallet = scannedPallets.filter(item => item.id === newPallet.id);
        if (alreadyScannedpallet.length > 0) {
          Toast.show({
            type: 'info',
            text1: strings('PALLET.PALLET_EXISTS'),
            visibilityTime: 3000,
            position: 'bottom'
          });
        } else {
          const newPalletItem = mapBinningPalletItem(newPallet);
          dispatch(addPallet(newPalletItem));
          Toast.show({
            type: 'success',
            text1: strings('LOCATION.PALLET_ADDED'),
            visibilityTime: 3000,
            position: 'bottom'
          });
        }
      } else if (getPalletApi.result.status === 204) {
        Toast.show({
          type: 'error',
          text1: strings('LOCATION.PALLET_NOT_FOUND'),
          visibilityTime: 3000,
          position: 'bottom'
        });
      }
      dispatch(hideActivityModal());
    }
    // on api error
    if (!getPalletApi.isWaiting && getPalletApi.error) {
      dispatch(hideActivityModal());
      Toast.show({
        type: 'error',
        text1: strings('LOCATION.ADD_PALLET_ERROR'),
        text2: strings('GENERICS.TRY_AGAIN'),
        visibilityTime: 4000,
        position: 'bottom'
      });
    }
    // on api request
    if (getPalletApi.isWaiting) {
      dispatch(showActivityModal());
    }
  }, [getPalletApi]);

  const handleUnhandledTouches = () => {
    Keyboard.dismiss();
    return false;
  };

  return (
    <KeyboardAvoidingView
      style={styles.safeAreaView}
      behavior="height"
      keyboardVerticalOffset={110}
      onStartShouldSetResponder={handleUnhandledTouches}
    >
      <View style={styles.container}>
        {isManualScanEnabled && <ManualScan placeholder={strings('PALLET.ENTER_PALLET_ID')} />}
        {palletExistForBinnning
          && (
          <View>
            <Text style={styles.helperText}>{strings('BINNING.SCAN_PALLET_BIN')}</Text>
            <ItemSeparator />
          </View>
          )}
        <FlatList
          data={scannedPallets}
          removeClippedSubviews={false}
          ItemSeparatorComponent={ItemSeparator}
          renderItem={binningItemCard}
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
          disabled={!palletExistForBinnning}
        />
      </View>
    </KeyboardAvoidingView>
  );
};
const Binning = (): JSX.Element => {
  const scannedPallets: BinningPallet[] = useTypedSelector(state => state.Binning.pallets);
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const isManualScanEnabled = useTypedSelector(state => state.Global.isManualScanEnabled);
  const getPalletApi = useTypedSelector(state => state.async.getPalletInfo);

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
      scannedPallets={scannedPallets}
      dispatch={dispatch}
      route={route}
      navigation={navigation}
      useEffectHook={useEffect}
      isManualScanEnabled={isManualScanEnabled}
      getPalletApi={getPalletApi}
    />
  );
};

export default Binning;
