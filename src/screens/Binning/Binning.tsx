import React, {
  EffectCallback, MutableRefObject, useEffect, useRef, useState
} from 'react';
import {
  BackHandler, EmitterSubscription, Keyboard, KeyboardAvoidingView, Text, TouchableOpacity, View
} from 'react-native';
import { head } from 'lodash';
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
import { BinningPallet } from '../../models/Binning';
import { addPallet, clearPallets, deletePallet } from '../../state/actions/Binning';
import { setScannedEvent } from '../../state/actions/Global';
import { setupPallet } from '../../state/actions/PalletManagement';
import { Pallet } from '../../models/PalletManagementTypes';
import BinningItemCard from '../../components/BinningItemCard/BinningItemCard';
import { CustomModalComponent } from '../Modal/Modal';

export interface BinningScreenProps {
  scannedPallets: BinningPallet[];
  route: RouteProp<any, string>;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  isManualScanEnabled: boolean;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  getPalletApi: AsyncState;
  scannedEvent: { value: any; type: string };
  isMounted: MutableRefObject<boolean>;
  palletClicked: boolean;
  setPalletClicked: React.Dispatch<React.SetStateAction<boolean>>;
  useFocusEffectHook: (effect: EffectCallback) => void;
  displayWarningModal: boolean;
  setDisplayWarningModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const navigateToPalletManagement = (
  palletId: number,
  dispatch: Dispatch<any>,
  setPalletClicked: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setPalletClicked(true);
  dispatch(getPalletInfo({ palletIds: [palletId], isAllItems: true }));
};

export const binningItemCard = (
  { item }: { item: BinningPallet },
  dispatch: Dispatch<any>,
  setPalletClicked: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const firstItem = head(item.items);
  return (
    <BinningItemCard
      palletId={item.id}
      itemDesc={firstItem ? firstItem.itemDesc : ''}
      lastLocation={item.lastLocation}
      canDelete
      onDelete={() => { dispatch(deletePallet(item.id)); }}
      onClick={() => { navigateToPalletManagement(item.id, dispatch, setPalletClicked); }}
    />
  );
};

const ItemSeparator = () => <View style={styles.separator} />;

const resetApis = (dispatch: Dispatch<any>) => {
  dispatch({ type: GET_PALLET_INFO.RESET });
};

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
    scannedPallets, isManualScanEnabled, dispatch, navigation, route, useEffectHook,
    getPalletApi, scannedEvent, isMounted, palletClicked, setPalletClicked, useFocusEffectHook,
    displayWarningModal, setDisplayWarningModal
  } = props;

  const palletExistForBinnning = scannedPallets.length > 0;

  let scannedSubscription: EmitterSubscription;

  // Scanner listener
  useEffectHook(() => {
    scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        dispatch(setScannedEvent(scan));
      }
    });
    return () => {
      scannedSubscription.remove();
    };
  }, []);

  useEffectHook(() => {
    if (isMounted.current) {
      if (navigation.isFocused()) {
        validateSession(navigation, route.name).then(() => {
          const alreadyScannedPallet = scannedPallets.find(item => item.id === parseInt(scannedEvent.value, 10));
          if (alreadyScannedPallet) {
            Toast.show({
              type: 'info',
              text1: strings('PALLET.PALLET_EXISTS'),
              visibilityTime: 3000,
              position: 'bottom'
            });
          } else {
            trackEvent('pallet_scanned', {
              barcode: scannedEvent.value,
              type: scannedEvent.type
            });
            dispatch(getPalletInfo({ palletIds: [scannedEvent.value] }));
          }
        });
      }
    } else {
      isMounted.current = true;
    }
  }, [scannedEvent]);

  useEffectHook(() => {
    // on api success
    if (!getPalletApi.isWaiting && getPalletApi.result) {
      if (getPalletApi.result.status === 200) {
        const {
          pallets
        } = getPalletApi.result.data;
        const newPallet = head(pallets) as BinningPallet;
        if (palletClicked) {
          setPalletClicked(false);
          const palletItems = newPallet.items.map(item => ({
            ...item,
            quantity: item.quantity || 0,
            newQuantity: item.quantity || 0,
            deleted: false,
            added: false
          }));
          const pmPallet: Pallet = {
            palletInfo: {
              id: newPallet.id,
              expirationDate: newPallet.expirationDate,
              createDate: newPallet.createDate
            },
            items: palletItems
          };
          dispatch(setupPallet(pmPallet));
          navigation.navigate('ManagePallet');
        } else {
          dispatch(addPallet(newPallet));
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
      resetApis(dispatch);
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
      resetApis(dispatch);
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
          renderItem={item => binningItemCard(item, dispatch, setPalletClicked)}
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
        {palletExistForBinnning
          && (
          <>
            <ItemSeparator />
            <Button
              title={strings('GENERICS.NEXT')}
              type={Button.Type.PRIMARY}
              style={styles.buttonWrapper}
              onPress={() => navigation.navigate('AssignLocation')}
            />
          </>
          )}
      </View>
    </KeyboardAvoidingView>
  );
};

const Binning = (): JSX.Element => {
  const scannedPallets = useTypedSelector(state => state.Binning.pallets);
  const [displayWarningModal, setDisplayWarningModal] = useState(false);
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const { scannedEvent, isManualScanEnabled } = useTypedSelector(state => state.Global);
  const getPalletApi = useTypedSelector(state => state.async.getPalletInfo);
  const isMounted = useRef(false);
  const [palletCLicked, setPalletClicked] = useState(false);

  return (
    <BinningScreen
      scannedPallets={scannedPallets}
      dispatch={dispatch}
      route={route}
      navigation={navigation}
      useEffectHook={useEffect}
      isManualScanEnabled={isManualScanEnabled}
      getPalletApi={getPalletApi}
      scannedEvent={scannedEvent}
      isMounted={isMounted}
      palletClicked={palletCLicked}
      setPalletClicked={setPalletClicked}
      useFocusEffectHook={useFocusEffect}
      displayWarningModal={displayWarningModal}
      setDisplayWarningModal={setDisplayWarningModal}
    />
  );
};

export default Binning;
