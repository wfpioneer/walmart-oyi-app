import React, { EffectCallback, useEffect } from 'react';
import {
  EmitterSubscription,
  FlatList,
  Pressable,
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
import Config from 'react-native-config';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import { barcodeEmitter, openCamera } from '../../utils/scannerUtils';
import styles from './CombinePallets.style';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { CombinePallet, PalletItem } from '../../models/PalletManagementTypes';
import Button, { ButtonType } from '../../components/buttons/Button';
import { validateSession } from '../../utils/sessionTimeout';
import { trackEvent } from '../../utils/AppCenterTool';
import { addCombinePallet, clearCombinePallet } from '../../state/actions/PalletManagement';
import CombinePalletCard from '../../components/CombinePalletCard/CombinePalletCard';
import ManualScanComponent from '../../components/manualscan/ManualScan';
import { combinePallets as combinePalletsSaga, getPalletDetails } from '../../state/actions/saga';
import { AsyncState } from '../../models/AsyncState';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { SNACKBAR_TIMEOUT } from '../../utils/global';

interface CombinePalletsProps {
  combinePallets: CombinePallet[];
  palletId: string;
  palletItems: PalletItem[];
  isManualScanEnabled: boolean;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  dispatch: Dispatch<any>;
  activityModal: boolean;
  getPalletDetailsApi: AsyncState;
  combinePalletsApi: AsyncState;
}

const ScanPalletComponent = (): JSX.Element => (
  <View style={styles.scanContainer}>
    <Icon name="information" size={40} color={COLOR.DISABLED_BLUE} />
    <Text style={styles.scanText}>{strings('PALLET.SCAN_PALLET')}</Text>
  </View>
);

export const getPalletDetailsApiEffect = (
  getPalletDetailsApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>
): void => {
  if (navigation.isFocused()) {
    // Success
    if (!getPalletDetailsApi.isWaiting && getPalletDetailsApi.result) {
      const { result } = getPalletDetailsApi;
      if (result.status === 200) {
        dispatch(addCombinePallet({
          itemCount: result.data.pallets[0].items.length,
          palletId: result.data.pallets[0].id
        }));
      } else if (result.status === 204) {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: strings('PALLET.PALLET_DOESNT_EXIST'),
          visibilityTime: SNACKBAR_TIMEOUT + 1000
        });
      }
      dispatch({ type: 'API/GET_PALLET_DETAILS/RESET' });
    }
    // Failure
    if (getPalletDetailsApi.error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: strings('PALLET.PALLET_DETAILS_ERROR'),
        visibilityTime: SNACKBAR_TIMEOUT + 1000
      });
      dispatch({ type: 'API/GET_PALLET_DETAILS/RESET' });
    }
  }
};

export const combinePalletsApiEffect = (
  combinePalletsApi: AsyncState,
  palletId: string,
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
      dispatch(getPalletDetails({ palletIds: [palletId], isAllItems: true, isSummary: false }));
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
    getPalletDetailsApi,
    combinePalletsApi
  } = props;
  let scannedSubscription: EmitterSubscription;

  // Scanner listener
  useEffectHook(() => {
    scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        validateSession(navigation, route.name).then(() => {
          const alreadyScanned = palletId === scan.value
             || combinePallets.some(pallet => pallet.palletId === scan.value);
          trackEvent('combine_pallet_scanned', {
            barcode: scan.value,
            type: scan.type,
            alreadyScanned
          });
          if (alreadyScanned) {
            Toast.show({
              type: 'error',
              position: 'bottom',
              text1: strings(palletId === scan.value
                ? 'PALLET.PALLET_EXISTS_AS_TARGET'
                : 'PALLET.PALLET_EXISTS'),
              visibilityTime: SNACKBAR_TIMEOUT
            });
          } else {
            dispatch(getPalletDetails({ palletIds: [scan.value], isAllItems: true, isSummary: false }));
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
          || getPalletDetailsApi.isWaiting) {
          dispatch(showActivityModal());
        }
      } else if (!combinePalletsApi.isWaiting
        && !getPalletDetailsApi.isWaiting) {
        dispatch(hideActivityModal());
      }
    }
  }, [activityModal, combinePalletsApi, getPalletDetailsApi]);

  useEffectHook(() => combinePalletsApiEffect(
    combinePalletsApi,
    palletId,
    navigation,
    dispatch
  ), [combinePalletsApi]);

  useEffectHook(() => getPalletDetailsApiEffect(getPalletDetailsApi, dispatch, navigation), [getPalletDetailsApi]);

  return (
    <View style={combinePallets.length > 0 ? styles.container : styles.flexContainer}>
      {/* TODO add change to pass Placeholder text to ManualScan component */}
      {isManualScanEnabled && <ManualScanComponent placeholder={strings('LOCATION.PALLET_PLACEHOLDER')} />}
      {combinePallets.length > 0 && (
        <View style={styles.scanView}>
          <Text style={styles.scanText} />
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
          <View style={styles.mergeView}>
            <Text style={styles.mergeText}>{strings('PALLET.PALLET_MERGE')}</Text>
          </View>
        )}
        <View style={combinePallets.length > 0 ? styles.palletInfoHeader : styles.palletInfoHeaderNoItems}>
          <Text style={styles.palletText}>
            {`${strings('PALLET.PALLET_ID')}: ${palletId}`}
          </Text>
          <Text style={styles.itemText}>
            {`${strings('GENERICS.ITEMS')}: ${palletItems.length}`}
          </Text>
        </View>
        {combinePallets.length > 0 && (
          <>
            <View style={styles.deletePalletInfoHeader}>
              <Text style={styles.deletePalletText}>
                {`${strings('PALLET.DELETE_ONCE_MERGED', { palletId: combinePallets[0].palletId })}`}
              </Text>
            </View>
            <View style={styles.palletScanContainer}>
              {isManualScanEnabled && <ManualScanComponent placeholder={strings('PALLET.ENTER_PALLET_ID')} />}
              <View style={styles.barcodeScanContainer}>
                <Pressable onPress={() => {
                  if (Config.ENVIRONMENT === 'dev' || Config.ENVIRONMENT === 'stage') {
                    return openCamera();
                  }
                  return null;
                }}
                >
                  <Icon size={100} name="barcode-scan" color={COLOR.BLACK} />
                </Pressable>
                <View style={styles.barCodeScanText}>
                  <Text>{strings('PALLET.SCAN_PALLET')}</Text>
                </View>
                <View style={styles.orText}>
                  <Text>{strings('GENERICS.OR')}</Text>
                </View>
              </View>
            </View>
          </>
        )}
        <Button
          title={strings('GENERICS.SAVE')}
          type={ButtonType.PRIMARY}
          style={styles.saveButton}
          onPress={() => dispatch(combinePalletsSaga({
            targetPallet: palletId,
            combinePallets: combinePallets.reduce(
              (prevVal: string[], currVal) => prevVal.concat(currVal.palletId), []
            )
          }))}
          disabled={combinePallets.length === 0}
        />
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
  const getPalletDetailsApi = useTypedSelector(state => state.async.getPalletDetails);
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
      getPalletDetailsApi={getPalletDetailsApi}
      combinePalletsApi={combinePalletsApi}
    />
  );
};

export default CombinePallets;
