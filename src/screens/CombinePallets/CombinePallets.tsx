import React, { EffectCallback, useEffect } from 'react';
import {
  EmitterSubscription,
  FlatList,
  Text,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import { barcodeEmitter } from '../../utils/scannerUtils';
import styles from './CombinePallets.style';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { CombinePallet, PalletItem } from '../../models/PalletManagementTypes';
import Button from '../../components/buttons/Button';
import { validateSession } from '../../utils/sessionTimeout';
import { trackEvent } from '../../utils/AppCenterTool';
import { addCombinePallet, clearCombinePallet } from '../../state/actions/PalletManagement';
import CombinePalletCard from '../../components/CombinePalletCard/CombinePalletCard';
import ManualScanComponent from '../../components/manualscan/ManualScan';
import { combinePallets as combinePalletsSaga, getPalletInfo } from '../../state/actions/saga';
import { AsyncState } from '../../models/AsyncState';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { SNACKBAR_TIMEOUT } from '../../utils/global';

interface CombinePalletsProps {
  combinePallets: CombinePallet[];
  palletId: number;
  palletItems: PalletItem[];
  isManualScanEnabled: boolean;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  dispatch: Dispatch<any>;
  activityModal: boolean;
  getPalletInfoApi: AsyncState;
  combinePalletsApi: AsyncState;
}

const ScanPalletComponent = (): JSX.Element => (
  <View style={styles.scanContainer}>
    <Icon name="information" size={40} color={COLOR.DISABLED_BLUE} />
    <Text style={styles.scanText}>{strings('PALLET.SCAN_PALLET')}</Text>
  </View>
);

export const getPalletInfoApiEffect = (
  palletInfoApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>
): void => {
  if (!palletInfoApi.isWaiting && navigation.isFocused()) {
    // Success
    if (palletInfoApi.result) {
      const { result } = palletInfoApi;
      if (result.status === 204) {
        Toast.show({
          type: 'info',
          position: 'bottom',
          text1: strings('PALLET.PALLET_DOESNT_EXIST'),
          visibilityTime: SNACKBAR_TIMEOUT + 1000
        });
      } else {
        dispatch(addCombinePallet({
          itemCount: result.data.pallets[0].items.length,
          palletId: result.data.pallets[0].id
        }));
      }
      dispatch({ type: 'API/GET_PALLET_INFO/RESET' });
    }

    // Failure
    if (palletInfoApi.error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: strings('PALLET.PALLET_DETAILS_ERROR'),
        visibilityTime: SNACKBAR_TIMEOUT + 1000
      });
      dispatch({ type: 'API/GET_PALLET_INFO/RESET' });
    }
  }
};

export const combinePalletsApiEffect = (
  combinePalletsApi: AsyncState,
  palletId: number,
  navigation: NavigationProp<any>,
  dispatch: Dispatch<any>
): void => {
  if (!combinePalletsApi.isWaiting) {
    // Success
    if (combinePalletsApi.result) {
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: strings('PALLET.COMBINE_PALLET_SUCCESS')
      });
      dispatch({ type: 'API/PATCH_COMBINE_PALLETS/RESET' });
      dispatch(getPalletInfo({ palletIds: [palletId], isAllItems: true, isSummary: false }));
      navigation.goBack();
    }

    // Failure
    if (combinePalletsApi.error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: strings('PALLET.COMBINE_PALLET_FAILURE')
      });
      dispatch({ type: 'API/PATCH_COMBINE_PALLETS/RESET' });
    }
  }
};

export const CombinePalletsScreen = (
  props: CombinePalletsProps
): JSX.Element => {
  const {
    combinePallets,
    palletId,
    palletItems,
    isManualScanEnabled,
    useEffectHook,
    route,
    navigation,
    dispatch,
    activityModal,
    getPalletInfoApi,
    combinePalletsApi
  } = props;
  let scannedSubscription: EmitterSubscription;

  // Scanner listener
  useEffectHook(() => {
    scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        validateSession(navigation, route.name).then(() => {
          const alreadyScanned = palletId.toString() === scan.value
             || combinePallets.some(pallet => pallet.palletId.toString() === scan.value);
          trackEvent('combine_pallet_scanned', {
            barcode: scan.value,
            type: scan.type,
            alreadyScanned
          });
          if (alreadyScanned) {
            Toast.show({
              type: 'error',
              position: 'bottom',
              text1: strings(palletId.toString() === scan.value
                ? 'PALLET.PALLET_EXISTS_AS_TARGET'
                : 'PALLET.PALLET_EXISTS'),
              visibilityTime: SNACKBAR_TIMEOUT
            });
          } else {
            dispatch(getPalletInfo({ palletIds: [scan.value], isAllItems: true, isSummary: false }));
          }
        });
      }
    });
    return () => {
      scannedSubscription.remove();
    };
  }, [combinePallets]);

  useEffectHook(() => {
    navigation.addListener('beforeRemove', () => {
      // Clear Combine Pallets state
      dispatch(clearCombinePallet());
    });
  }, []);

  /**
   * API modal
   */
  useEffectHook(() => {
    if (navigation.isFocused()) {
      if (!activityModal) {
        if (combinePalletsApi.isWaiting
          || getPalletInfoApi.isWaiting) {
          dispatch(showActivityModal());
        }
      } else if (!combinePalletsApi.isWaiting
        && !getPalletInfoApi.isWaiting) {
        dispatch(hideActivityModal());
      }
    }
  }, [activityModal, combinePalletsApi, getPalletInfoApi]);

  useEffectHook(() => combinePalletsApiEffect(
    combinePalletsApi,
    palletId,
    navigation,
    dispatch
  ), [combinePalletsApi]);

  useEffectHook(() => getPalletInfoApiEffect(getPalletInfoApi, dispatch, navigation), [getPalletInfoApi]);

  return (
    <View style={styles.container}>
      {/* TODO add change to pass Placeholder text to ManualScan component */}
      {isManualScanEnabled && <ManualScanComponent placeholder={strings('GENERICS.ENTER_UPC_ITEM_NBR')} />}
      {combinePallets.length > 0 && (
        <View style={styles.scanView}>
          <Text style={styles.scanText}>{strings('PALLET.SCAN_PALLET')}</Text>
        </View>
      )}
      <FlatList
        data={combinePallets}
        renderItem={({ item }) => (
          <CombinePalletCard item={item} dispatch={dispatch} />
        )}
        keyExtractor={(item: CombinePallet) => item.palletId.toString()}
        ListEmptyComponent={ScanPalletComponent()}
      />
      <View style={styles.palletContainer}>
        {combinePallets.length > 0 && (
          <Text style={styles.mergeText}>{strings('PALLET.PALLET_MERGE')}</Text>
        )}
        <View style={styles.palletInfoHeader}>
          <Text style={styles.palletText}>
            {`${strings('LOCATION.PALLET')}: ${palletId}`}
          </Text>
          <Text style={styles.itemText}>
            {`${strings('GENERICS.ITEMS')}: ${palletItems.length}`}
          </Text>
        </View>
        <View style={styles.saveButton}>
          <Button
            title={strings('GENERICS.SAVE')}
            type={Button.Type.PRIMARY}
            style={{ width: '90%' }}
            onPress={() => dispatch(combinePalletsSaga({
              targetPallet: palletId,
              combinePallets: combinePallets.reduce(
                (prevVal: number[], currVal) => prevVal.concat(currVal.palletId), []
              )
            }))}
            disabled={combinePallets.length === 0}
          />
        </View>
      </View>
    </View>
  );
};

const CombinePallets = (): JSX.Element => {
  const { combinePallets, palletInfo, items } = useTypedSelector(
    state => state.PalletManagement
  );
  const isManualScanEnabled = useTypedSelector(
    state => state.Global.isManualScanEnabled
  );
  const activityModal = useTypedSelector(state => state.modal.showActivity);
  const getPalletInfoApi = useTypedSelector(state => state.async.getPalletInfo);
  const combinePalletsApi = useTypedSelector(state => state.async.combinePallets);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  return (
    <CombinePalletsScreen
      combinePallets={combinePallets}
      palletId={palletInfo.id}
      palletItems={items}
      isManualScanEnabled={isManualScanEnabled}
      useEffectHook={useEffect}
      route={route}
      navigation={navigation}
      dispatch={dispatch}
      activityModal={activityModal}
      getPalletInfoApi={getPalletInfoApi}
      combinePalletsApi={combinePalletsApi}
    />
  );
};

export default CombinePallets;
