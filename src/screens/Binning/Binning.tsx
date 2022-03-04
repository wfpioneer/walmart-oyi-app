import React, {
  EffectCallback, useEffect, useState
} from 'react';
import {
  BackHandler, EmitterSubscription, Keyboard, KeyboardAvoidingView, Text, TouchableOpacity, View
} from 'react-native';
import { head, omit } from 'lodash';
import { trackEvent } from 'appcenter-analytics';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import Toast from 'react-native-toast-message';
import {
  NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute
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
import { addPallet, clearPallets } from '../../state/actions/Binning';
import { CustomModalComponent } from '../Modal/Modal';

export interface BinningScreenProps {
  scannedPallets: BinningPallet[] | [];
  route: RouteProp<any, string>;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  isManualScanEnabled: boolean;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  getPalletApi: AsyncState;
  useFocusEffectHook: (effect: EffectCallback) => void;
  displayWarningModal: boolean;
  setDisplayWarningModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface PalletInfo {
  id: number;
  createDate?: string;
  expirationDate?: string;
  items: PalletItem[] | []
}

// TODO: This component has to designed as part of INTLSAOPS-5163
export const binningItemCard = ({ item }: { item: BinningPallet }): JSX.Element => (
  <View>
    <View>
      <Text>{`Id: ${item.id}`}</Text>
      {item?.lastLocation && <Text>{`Last Loc: ${item?.lastLocation}`}</Text>}
    </View>
    <View>
      <Text>{`First Item: ${item.firstItem?.itemDesc}`}</Text>
      <TouchableOpacity style={styles.icon}>
        <View>
          <Icon name="trash-can" size={20} color={COLOR.TRACKER_GREY} />
        </View>
      </TouchableOpacity>
    </View>
  </View>
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

const onValidateHardwareBackPress = (props: BinningScreenProps) => {
  const { setDisplayWarningModal, scannedPallets } = props;
  if (scannedPallets.length > 0) {
    setDisplayWarningModal(true);
    return true;
  }
  return false;
};

export const BinningScreen = (props: BinningScreenProps): JSX.Element => {
  const {
    scannedPallets, isManualScanEnabled, dispatch, navigation, route, useEffectHook, getPalletApi, useFocusEffectHook,
    displayWarningModal, setDisplayWarningModal
  } = props;

  const palletExistForBinnning = scannedPallets.length > 0;

  let scannedSubscription: EmitterSubscription;

  // Clear API state before leaving this screen
  useEffectHook(() => navigation.addListener('beforeRemove', () => {
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

  // validation on app back press
  useEffectHook(() => {
    const navigationListener = navigation.addListener('beforeRemove', e => {
      if (scannedPallets.length > 0) {
        setDisplayWarningModal(true);
        e.preventDefault();
      }
    });
    return navigationListener;
  }, [navigation, scannedPallets]);

  useEffectHook(() => {
    if (displayWarningModal && !palletExistForBinnning) {
      setDisplayWarningModal(false);
      navigation.goBack();
    }
  }, [palletExistForBinnning]);

  // validation on Hardware backPress
  useFocusEffectHook(
    () => {
      const onHardwareBackPress = () => onValidateHardwareBackPress(props);
      BackHandler.addEventListener('hardwareBackPress', onHardwareBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onHardwareBackPress);
    }
  );

  const handleUnhandledTouches = () => {
    Keyboard.dismiss();
    return false;
  };

  const backConfirmed = () => {
    setDisplayWarningModal(false);
    dispatch(clearPallets());
    navigation.goBack();
  };

  const renderWarningModal = () => (
    <CustomModalComponent
      isVisible={displayWarningModal}
      onClose={() => setDisplayWarningModal(false)}
      modalType="Popup"
    >
      <>
        <View>
          <Text style={styles.labelHeader}>{strings('BINNING.WARNING_LABEL')}</Text>
          <Text style={styles.message}>{strings('BINNING.WARNING_DESCRIPTION')}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            style={styles.buttonAlign}
            title={strings('GENERICS.CANCEL')}
            titleColor={COLOR.MAIN_THEME_COLOR}
            type={Button.Type.SOLID_WHITE}
            onPress={() => setDisplayWarningModal(false)}
          />
          <Button
            style={styles.buttonAlign}
            title={strings('GENERICS.OK')}
            type={Button.Type.PRIMARY}
            onPress={backConfirmed}
          />
        </View>
      </>
    </CustomModalComponent>
  );

  return (
    <KeyboardAvoidingView
      style={styles.safeAreaView}
      behavior="height"
      keyboardVerticalOffset={110}
      onStartShouldSetResponder={handleUnhandledTouches}
    >
      <View style={styles.container}>
        {renderWarningModal()}
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
  const [displayWarningModal, setDisplayWarningModal] = useState(false);
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const isManualScanEnabled = useTypedSelector(state => state.Global.isManualScanEnabled);
  const getPalletApi = useTypedSelector(state => state.async.getPalletInfo);

  return (
    <BinningScreen
      scannedPallets={scannedPallets}
      dispatch={dispatch}
      route={route}
      navigation={navigation}
      useEffectHook={useEffect}
      isManualScanEnabled={isManualScanEnabled}
      getPalletApi={getPalletApi}
      useFocusEffectHook={useFocusEffect}
      displayWarningModal={displayWarningModal}
      setDisplayWarningModal={setDisplayWarningModal}
    />
  );
};

export default Binning;
