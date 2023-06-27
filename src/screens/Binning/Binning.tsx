import React, {
  MutableRefObject, useCallback, useEffect, useMemo, useRef, useState
} from 'react';
import {
  BackHandler,
  EmitterSubscription,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  Text,
  View
} from 'react-native';
import { head } from 'lodash';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import Toast from 'react-native-toast-message';
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Config from 'react-native-config';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
// eslint-disable-next-line import/no-unresolved
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { trackEvent } from '../../utils/AppCenterTool';
import { barcodeEmitter, openCamera } from '../../utils/scannerUtils';
import { validateSession } from '../../utils/sessionTimeout';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import styles from './Binning.style';
import ManualScan from '../../components/manualscan/ManualScan';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import {
  getPalletDetails
} from '../../state/actions/saga';
import {
  GET_PALLET_DETAILS
} from '../../state/actions/asyncAPI';
import { AsyncState } from '../../models/AsyncState';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { BinningPallet } from '../../models/Binning';
import {
  addPallet,
  clearPallets,
  toggleBinMenu,
  toggleMultiBin
} from '../../state/actions/Binning';
import { resetScannedEvent, setScannedEvent } from '../../state/actions/Global';
import { BeforeRemoveEvent, ScannedEvent, UseStateType } from '../../models/Generics.d';
import { CustomModalComponent } from '../Modal/Modal';
import Button, { ButtonType } from '../../components/buttons/Button';
import BinningItemCard from '../../components/BinningItemCard/BinningItemCard';
import { Pallet } from '../../models/PalletManagementTypes';
import { setupPallet } from '../../state/actions/PalletManagement';
import BottomSheetMultiBinCard from '../../components/BottomSheetMultiBinCard/BottomSheetMultiBinCard';

const SCREEN_NAME = 'Binning_Screen';
export interface BinningScreenProps {
  scannedPallets: BinningPallet[];
  route: RouteProp<any, string>;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  isManualScanEnabled: boolean;
  useEffectHook: typeof useEffect;
  useFocusEffectHook: typeof useFocusEffect;
  useCallbackHook: typeof useCallback;
  getPalletDetailsApi: AsyncState;
  scannedEvent: { value: any; type: string | null};
  isMounted: MutableRefObject<boolean>;
  trackEventCall: typeof trackEvent;
  enableMultiPalletBin: boolean;
  displayWarningModalState: UseStateType<boolean>;
}

export const onValidateHardwareBackPress = (
  setDisplayWarningModal: UseStateType<boolean>[1],
  scannedPallets: BinningPallet[]
) => {
  if (scannedPallets.length > 0) {
    setDisplayWarningModal(true);
    return true;
  }
  return false;
};

export const backConfirmed = (
  setDisplayWarningModal: UseStateType<boolean>[1],
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>
) => {
  setDisplayWarningModal(false);
  dispatch(clearPallets());
  navigation.goBack();
};

const ItemSeparator = () => <View style={styles.separator} />;

export const onBinningItemPress = (
  pallet: BinningPallet,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  trackEventCall: typeof trackEvent
) => {
  const palletItems = pallet.items.map(item => ({
    ...item,
    quantity: item.quantity || 0,
    price: item.price || 0,
    newQuantity: item.quantity || 0,
    deleted: false,
    added: false
  }));
  const pmPallet: Pallet = {
    palletInfo: {
      id: pallet.id,
      expirationDate: pallet.expirationDate,
      createDate: pallet.createDate
    },
    items: palletItems
  };
  dispatch(setupPallet(pmPallet));
  trackEventCall('BINNING_SCREEN', {
    action: 'navigation_to_pallet_management_from_binning',
    palletId: pallet.id
  });
  navigation.navigate('ManagePallet');
};

export const binningItemCard = (
  { item }: { item: BinningPallet },
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  trackEventCall: typeof trackEvent
) => {
  const firstItem = head(item.items);
  return (
    <BinningItemCard
      palletId={item.id}
      itemDesc={firstItem ? firstItem.itemDesc : ''}
      lastLocation={item.lastLocation}
      onClick={() => onBinningItemPress(item, dispatch, navigation, trackEventCall)}
    />
  );
};

export const renderWarningModal = (
  displayWarningModal: boolean,
  setDisplayWarningModal: UseStateType<boolean>[1],
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>
) => (
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
          type={ButtonType.SOLID_WHITE}
          onPress={() => setDisplayWarningModal(false)}
        />
        <Button
          style={styles.buttonAlign}
          title={strings('GENERICS.OK')}
          type={ButtonType.PRIMARY}
          onPress={() => backConfirmed(setDisplayWarningModal, dispatch, navigation)}
        />
      </View>
    </>
  </CustomModalComponent>
);

export const resetApis = (dispatch: Dispatch<any>) => {
  dispatch({ type: GET_PALLET_DETAILS.RESET });
};

export const navigateAssignLocationScreen = (
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  route: RouteProp<any>
) => {
  dispatch(resetScannedEvent());
  navigation.navigate('AssignLocation', route.params);
};

export const getPalletDetailsApiHook = (
  getPalletDetailsApi: AsyncState,
  trackEventCall: typeof trackEvent,
  dispatch: Dispatch<any>,
  enableMultiPalletBin: boolean,
  navigation: NavigationProp<any>,
  route: RouteProp<any>
) => {
  // on api success
  if (!getPalletDetailsApi.isWaiting && getPalletDetailsApi.result) {
    if (getPalletDetailsApi.result.status === 200) {
      const {
        pallets
      } = getPalletDetailsApi.result.data;
      const newPallet = head(pallets) as BinningPallet;
      trackEventCall(SCREEN_NAME, {
        action: 'added_pallet_to_bin_list',
        palletId: newPallet.id
      });
      dispatch(addPallet(newPallet));
      if (!enableMultiPalletBin) {
        navigateAssignLocationScreen(dispatch, navigation, route);
      }
    } else if (getPalletDetailsApi.result.status === 204) {
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
  if (!getPalletDetailsApi.isWaiting && getPalletDetailsApi.error) {
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
  if (getPalletDetailsApi.isWaiting) {
    dispatch(showActivityModal());
  }
};

export const navigationRemoveListenerHook = (
  e: BeforeRemoveEvent,
  setDisplayWarningModal: UseStateType<boolean>[1],
  enableMultiPalletBin: boolean,
  palletsToBin: BinningPallet[]
) => {
  if (!enableMultiPalletBin && palletsToBin.length > 0) {
    setDisplayWarningModal(true);
    e.preventDefault();
  }
};

export const backConfirmedHook = (
  displayWarningModal: boolean,
  palletExistForBinnning: boolean,
  setDisplayWarningModal: UseStateType<boolean>[1],
  navigation: NavigationProp<any>
) => {
  if (displayWarningModal && !palletExistForBinnning) {
    setDisplayWarningModal(false);
    navigation.goBack();
  }
};

export const bottomModalPresentationHook = (
  navigation: NavigationProp<any>,
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>,
  showBinningMenu: boolean
) => {
  if (navigation.isFocused() && bottomSheetModalRef.current) {
    if (showBinningMenu) {
      bottomSheetModalRef.current.present();
    } else {
      bottomSheetModalRef.current.dismiss();
    }
  }
};

export const callPalletDetailsHook = (
  scannedPallets: BinningPallet[],
  scannedEvent: ScannedEvent,
  trackEventCall: typeof trackEvent,
  dispatch: Dispatch<any>
) => {
  const alreadyScannedPallet = scannedPallets.find(item => item.id === scannedEvent.value);
  if (alreadyScannedPallet) {
    Toast.show({
      type: 'info',
      text1: strings('PALLET.PALLET_EXISTS'),
      visibilityTime: 3000,
      position: 'bottom'
    });
  } else if (scannedEvent.value) {
    trackEventCall(SCREEN_NAME, {
      action: 'pallet_scanned',
      barcode: scannedEvent.value,
      type: scannedEvent.type ?? ''
    });
    dispatch(getPalletDetails({ palletIds: [scannedEvent.value] }));
  }
};

export const scannedEventHook = (
  isMounted: React.MutableRefObject<boolean>,
  navigation: NavigationProp<any>,
  route: RouteProp<any>,
  scannedPallets: BinningPallet[],
  scannedEvent: { value: any; type: string | null },
  trackEventCall: typeof trackEvent,
  dispatch: Dispatch<any>
) => {
  if (isMounted.current) {
    if (navigation.isFocused()) {
      validateSession(navigation, route.name).then(() => callPalletDetailsHook(
        scannedPallets,
        scannedEvent,
        trackEventCall,
        dispatch
      ));
    }
  } else {
    isMounted.current = true;
  }
};

export const BinningScreen = (props: BinningScreenProps): JSX.Element => {
  const {
    scannedPallets, isManualScanEnabled, dispatch, navigation, route,
    useEffectHook, useFocusEffectHook, useCallbackHook, getPalletDetailsApi, scannedEvent,
    isMounted, trackEventCall, enableMultiPalletBin, displayWarningModalState
  } = props;
  const [displayWarningModal, setDisplayWarningModal] = displayWarningModalState;

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

  // validation on app back press
  useEffectHook(() => navigation.addListener('beforeRemove', e => {
    navigationRemoveListenerHook(e, setDisplayWarningModal, enableMultiPalletBin, scannedPallets);
  }), [navigation, scannedPallets]);

  useEffectHook(() => backConfirmedHook(
    displayWarningModal,
    palletExistForBinnning,
    setDisplayWarningModal,
    navigation
  ), [palletExistForBinnning, displayWarningModal]);

  // validation on Hardware backPress
  useFocusEffectHook(
    useCallbackHook(() => {
      const onHardwareBackPress = () => onValidateHardwareBackPress(setDisplayWarningModal, scannedPallets);
      BackHandler.addEventListener('hardwareBackPress', onHardwareBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onHardwareBackPress);
    }, [])
  );

  useEffectHook(() => scannedEventHook(
    isMounted,
    navigation,
    route,
    scannedPallets,
    scannedEvent,
    trackEventCall,
    dispatch
  ), [scannedEvent]);

  useEffectHook(() => getPalletDetailsApiHook(
    getPalletDetailsApi,
    trackEventCall,
    dispatch,
    enableMultiPalletBin,
    navigation,
    route
  ), [getPalletDetailsApi, enableMultiPalletBin]);

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
      {renderWarningModal(displayWarningModal, setDisplayWarningModal, dispatch, navigation)}
      <View style={styles.container}>
        {isManualScanEnabled && <ManualScan placeholder={strings('PALLET.ENTER_PALLET_ID')} />}
        {palletExistForBinnning
          && (
          <View>
            <Text style={styles.helperText}>{strings('BINNING.SCAN_PALLET_BIN')}</Text>
            <ItemSeparator />
          </View>
          )}
        <View style={styles.emptyFlatListContainer}>
          {!enableMultiPalletBin && (
            <View style={styles.scanContainer}>
              <Pressable
                onPress={() => openCamera()}
                disabled={Config.ENVIRONMENT === 'prod'}
                testID="camScan"
              >
                <Icon size={100} name="barcode-scan" color={COLOR.BLACK} />
              </Pressable>
              <View style={styles.scanText}>
                <Text>{strings('BINNING.SCAN_PALLET')}</Text>
              </View>
            </View>
          )}
          {enableMultiPalletBin && (
          <FlatList
            data={scannedPallets}
            removeClippedSubviews={false}
            contentContainerStyle={!palletExistForBinnning && styles.emptyFlatListContainer}
            ItemSeparatorComponent={ItemSeparator}
            renderItem={item => binningItemCard(item, dispatch, navigation, trackEventCall)}
            keyExtractor={(item: any, index) => `${item.id.toString()}-${index}`}
            ListEmptyComponent={(
              <View style={styles.scanContainer}>
                <Pressable
                  onPress={() => openCamera()}
                  disabled={Config.ENVIRONMENT === 'prod'}
                  testID="flatlistCamScan"
                >
                  <Icon size={100} name="barcode-scan" color={COLOR.BLACK} />
                </Pressable>
                <View style={styles.scanText}>
                  <Text>{strings('BINNING.SCAN_PALLET')}</Text>
                </View>
              </View>
          )}
          />
          )}
        </View>
        {enableMultiPalletBin && palletExistForBinnning
          && (
          <>
            <ItemSeparator />
            <Button
              title={strings('GENERICS.NEXT')}
              type={ButtonType.PRIMARY}
              style={styles.buttonWrapper}
              onPress={() => {
                trackEventCall(SCREEN_NAME, {
                  action: 'added_pallets_for_assigning_location',
                  palletIds: scannedPallets.map(pallet => pallet.id).join(','),
                  otherInfo: 'navigating_to_assign_location'
                });
                navigateAssignLocationScreen(dispatch, navigation, route);
              }}
              testID="nextButton"
            />
          </>
          )}
      </View>
    </KeyboardAvoidingView>
  );
};

const Binning = (): JSX.Element => {
  const {
    pallets: scannedPallets, enableMultiplePalletBin, showBinningMenu
  } = useTypedSelector(state => state.Binning);
  const { scannedEvent, isManualScanEnabled } = useTypedSelector(state => state.Global);
  const getPalletDetailsApi = useTypedSelector(state => state.async.getPalletDetails);
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const isMounted = useRef(false);
  const displayWarningModalState = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['20%'], []);

  useEffect(() => {
    bottomModalPresentationHook(navigation, bottomSheetModalRef, showBinningMenu);
  }, [showBinningMenu]);

  const renderBackdrop = useCallback(
    // eslint-disable-next-line no-shadow
    props => (
      <BottomSheetBackdrop
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  return (
    <BottomSheetModalProvider>
      <BinningScreen
        scannedPallets={scannedPallets}
        dispatch={dispatch}
        route={route}
        navigation={navigation}
        useEffectHook={useEffect}
        useCallbackHook={useCallback}
        useFocusEffectHook={useFocusEffect}
        isManualScanEnabled={isManualScanEnabled}
        getPalletDetailsApi={getPalletDetailsApi}
        scannedEvent={scannedEvent}
        isMounted={isMounted}
        trackEventCall={trackEvent}
        enableMultiPalletBin={enableMultiplePalletBin}
        displayWarningModalState={displayWarningModalState}
      />
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        index={0}
        onDismiss={() => {
          trackEvent(SCREEN_NAME, { action: 'hide_binning_bottom_sheet_modal' });
          dispatch(toggleBinMenu(false));
        }}
        style={styles.bottomSheetModal}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetMultiBinCard
          enableMultiBin={enableMultiplePalletBin}
          onPress={() => dispatch(toggleMultiBin())}
          text={strings('BINNING.MULTIPLE_BIN_ENABLED')}
        />
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default Binning;
