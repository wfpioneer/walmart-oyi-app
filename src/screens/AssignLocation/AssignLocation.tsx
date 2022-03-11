import React, { EffectCallback, useEffect } from 'react';
import {
  FlatList, Pressable, Text, View
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  NavigationProp, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { head } from 'lodash';
import ManualScanComponent from '../../components/manualscan/ManualScan';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { setScannedEvent } from '../../state/actions/Global';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { clearPallets, deletePallet } from '../../state/actions/Binning';
import { binPallets } from '../../state/actions/saga';
import { POST_BIN_PALLETS } from '../../state/actions/asyncAPI';
import { BinningPallet } from '../../models/Binning';
import { AsyncState } from '../../models/AsyncState';
import { PostBinPalletsMultistatusResponse } from '../../services/PalletManagement.service';
import { trackEvent } from '../../utils/AppCenterTool';
import { barcodeEmitter, openCamera } from '../../utils/scannerUtils';
import { SNACKBAR_TIMEOUT } from '../../utils/global';
import { validateSession } from '../../utils/sessionTimeout';
import { strings } from '../../locales';
import styles from './AssignLocation.style';
import COLOR from '../../themes/Color';
import BinningItemCard from '../../components/BinningItemCard/BinningItemCard';
import { cleanScanIfUpcOrEanBarcode } from '../../utils/barcodeUtils';

interface AssignLocationProps {
  palletsToBin: BinningPallet[];
  isManualScanEnabled: boolean;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  dispatch: Dispatch<any>;
  scannedEvent: { value: string | null; type: string | null };
  binPalletsApi: AsyncState;
}
const ItemSeparator = () => <View style={styles.separator} />;

export const binningItemCardReadOnly = (
  { item }: { item: BinningPallet },
) => {
  const firstItem = head(item.items);
  return (
    <BinningItemCard
      palletId={item.id}
      itemDesc={firstItem ? firstItem.itemDesc : ''}
      lastLocation={item.lastLocation}
    />
  );
};

export const getFailedPallets = (data: PostBinPalletsMultistatusResponse): number[] => data.binSummary
  .reduce((failIds: number[], currentResponse) => (currentResponse.status === 200
    ? failIds
    : [...failIds, currentResponse.palletId]), []);

export const binPalletsApiEffect = (
  navigation: NavigationProp<any>,
  binPalletsApi: AsyncState,
  dispatch: Dispatch<any>
) => {
  if (navigation.isFocused()) {
    if (!binPalletsApi.isWaiting) {
      dispatch(hideActivityModal());
      // Success
      if (binPalletsApi.result) {
        if (binPalletsApi.result.status === 207) {
          const failedPallets = getFailedPallets(binPalletsApi.result.data as PostBinPalletsMultistatusResponse);
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: strings('BINNING.PALLET_BIN_PARTIAL', { number: failedPallets.length }),
            visibilityTime: SNACKBAR_TIMEOUT + 1000
          });

          failedPallets.forEach(palletId => dispatch(deletePallet(palletId)));
          dispatch({ type: POST_BIN_PALLETS.RESET });
        } else {
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: strings('BINNING.PALLET_BIN_SUCCESS'),
            visibilityTime: SNACKBAR_TIMEOUT
          });

          dispatch(clearPallets());
          dispatch({ type: POST_BIN_PALLETS.RESET });
          navigation.goBack();
        }
      }

      // Fail
      if (binPalletsApi.error) {
        Toast.show({
          position: 'bottom',
          type: 'error',
          text1: strings('BINNING.PALLET_BIN_FAILURE'),
          visibilityTime: SNACKBAR_TIMEOUT
        });
        dispatch({ type: POST_BIN_PALLETS.RESET });
      }
    } else {
      dispatch(showActivityModal());
    }
  }
};

export function AssignLocationScreen(props: AssignLocationProps): JSX.Element {
  const {
    palletsToBin, isManualScanEnabled, useEffectHook,
    navigation, dispatch, route, scannedEvent, binPalletsApi
  } = props;

  useEffectHook(() => {
    if (navigation.isFocused() && scannedEvent.value) {
      const searchValue = cleanScanIfUpcOrEanBarcode(scannedEvent);
      dispatch(binPallets({
        location: searchValue,
        pallets: palletsToBin.reduce((palletIds: number[], pallet) => [...palletIds, pallet.id], [])
      }));
    }
  }, [scannedEvent]);

  useEffectHook(() => {
    const scannerListener = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        validateSession(navigation, route.name).then(() => {
          trackEvent('bin_location_scanned', {
            barcode: scan.value,
            type: scan.type
          });
          dispatch(setScannedEvent(scan));
        });
      }
    });

    return () => {
      scannerListener.remove();
    };
  }, []);

  useEffectHook(() => binPalletsApiEffect(
    navigation,
    binPalletsApi,
    dispatch
  ), [binPalletsApi]);

  const scanTextView = () => (
    <View style={styles.scanView}>
      {/* TODO make dev only? */}
      <Pressable onPress={() => openCamera()}>
        <MaterialCommunityIcon
          name="barcode-scan"
          size={70}
          color={COLOR.MAIN_THEME_COLOR}
        />
      </Pressable>
      <Text style={styles.scanText}>
        {palletsToBin.length === 1
          ? strings('BINNING.SCAN_LOCATION')
          : strings('BINNING.SCAN_LOCATION_PLURAL')}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {isManualScanEnabled && (
        <ManualScanComponent
          placeholder={strings('LOCATION.MANUAL_ENTRY_BUTTON')}
          keyboardType="default"
        />
      )}
      <FlatList
        data={palletsToBin}
        renderItem={item => binningItemCardReadOnly(item)}
        removeClippedSubviews={false}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={(item, index) => `${item.id}-${index}`}
      />
      {scanTextView()}
    </View>
  );
}

function AssignLocation(): JSX.Element {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const isManualScanEnabled = useTypedSelector(state => state.Global.isManualScanEnabled);
  const palletsToBin = useTypedSelector(state => state.Binning.pallets);
  const scannedEvent = useTypedSelector(state => state.Global.scannedEvent);
  const binPalletsApi = useTypedSelector(state => state.async.binPallets);

  return (
    <AssignLocationScreen
      palletsToBin={palletsToBin}
      isManualScanEnabled={isManualScanEnabled}
      useEffectHook={useEffect}
      dispatch={dispatch}
      navigation={navigation}
      route={route}
      scannedEvent={scannedEvent}
      binPalletsApi={binPalletsApi}
    />
  );
}

export default AssignLocation;
