import React, { EffectCallback, useEffect } from 'react';
import {
  EmitterSubscription, Keyboard, KeyboardAvoidingView, Text, TouchableOpacity, View
} from 'react-native';
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

export interface BinningScreenProps {
  pallets: Pallet[] | [];
  route: RouteProp<any, string>;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  isManualScanEnabled: boolean;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  getPalletApi: AsyncState
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
    pallets, isManualScanEnabled, dispatch, navigation, route, useEffectHook, getPalletApi
  } = props;

  let scannedSubscription: EmitterSubscription;

  // Clear API state before leaving this screen
  useEffectHook(() => navigation.addListener('beforeRemove', () => {
    // TODO: we have to add warning Modal
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
          data
        } = getPalletApi.result;
        const palletItem = pallets.filter(item => item.palletId === data.palletId);
        if (palletItem.length > 0) {
          Toast.show({
            type: 'info',
            text1: strings('PALLET.PALLET_EXISTS'),
            visibilityTime: 3000,
            position: 'bottom'
          });
        } else {
          // TODO: dispatch action to store the pallet in redux after INTLSAOPS-5162 get completed
          Toast.show({
            type: 'success',
            text1: strings('LOCATION.PALLET_ADDED'),
            visibilityTime: 3000,
            position: 'bottom'
          });
        }
      } else if (getPalletApi.result.status === 204) {
        Toast.show({
          type: 'info',
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
    </KeyboardAvoidingView>
  );
};
const Binning = (): JSX.Element => {
  // TODO: pallets and binLocation needs to be connected to Redux
  const pallets: Pallet[] = [];
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const isManualScanEnabled = useTypedSelector(state => state.Global.isManualScanEnabled);
  const getPalletApi = useTypedSelector(state => state.async.getPalletInfo);

  return (
    <BinningScreen
      pallets={pallets}
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
