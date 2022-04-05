import React, {
  Dispatch, EffectCallback, useEffect, useState
} from 'react';
import {
  ActivityIndicator,
  EmitterSubscription,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import COLOR from '../../themes/Color';
import styles from './PalletManagement.style';
import { strings } from '../../locales';
import { barcodeEmitter, openCamera } from '../../utils/scannerUtils';
import { validateSession } from '../../utils/sessionTimeout';
import { getPalletInfo } from '../../state/actions/saga';
import { AsyncState } from '../../models/AsyncState';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { trackEvent } from '../../utils/AppCenterTool';
import { setupPallet } from '../../state/actions/PalletManagement';
import { GET_PALLET_INFO } from '../../state/actions/asyncAPI';
import { Pallet, PalletItem } from '../../models/PalletManagementTypes';

interface PalletManagementProps {
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  dispatch: Dispatch<any>;
  getPalletInfoApi: AsyncState;
}
const palletIDRegex = new RegExp(/^[0-9]+$/);
const nonNumRegex = new RegExp(/[^0-9]/g);

export const onSubmit = (searchText: string, dispatch: Dispatch<any>): void => {
  if (searchText.match(palletIDRegex)) {
    dispatch(
      getPalletInfo({
        palletIds: [Number.parseInt(searchText, 10)],
        isAllItems: true,
        isSummary: false
      })
    );
  }
};

export const PalletManagementScreen = (
  props: PalletManagementProps
): JSX.Element => {
  const {
    useEffectHook,
    searchText,
    setSearchText,
    navigation,
    route,
    dispatch,
    getPalletInfoApi
  } = props;

  let scannedSubscription: EmitterSubscription;

  const resetSearchText = () => setSearchText('');

  // Resets Get PalletInfo api state when navigating off-screen
  useEffectHook(() => {
    navigation.addListener('blur', () => {
      if (getPalletInfoApi.value) {
        dispatch({ type: GET_PALLET_INFO.RESET });
        resetSearchText();
      }
    });
  }, [getPalletInfoApi]);

  // Scanner listener
  useEffectHook(() => {
    scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        validateSession(navigation, route.name).then(() => {
          trackEvent('pallet_managment_scanned', {
            barcode: scan.value,
            type: scan.type
          });
          setSearchText(scan.value);
          dispatch(
            getPalletInfo({ palletIds: [scan.value], isAllItems: true, isSummary: false })
          );
        });
      }
    });
    return () => {
      scannedSubscription.remove();
    };
  }, []);

  // Get Pallet Info Api
  useEffectHook(() => {
    if (navigation.isFocused()) {
      // on api success
      if (!getPalletInfoApi.isWaiting && getPalletInfoApi.result) {
        if (getPalletInfoApi.result.status === 200) {
          const {
            id, createDate, expirationDate, items
          } = getPalletInfoApi.result.data.pallets[0];
          const palletItems = items.map((item: PalletItem) => ({
            ...item,
            quantity: item.quantity || 0,
            newQuantity: item.quantity || 0,
            deleted: false,
            added: false
          }));
          const palletDetails: Pallet = {
            palletInfo: {
              id,
              createDate,
              expirationDate
            },
            items: palletItems
          };
          dispatch(setupPallet(palletDetails));
          navigation.navigate('ManagePallet');
        } else if (getPalletInfoApi.result.status === 204) {
          Toast.show({
            type: 'error',
            text1: strings('LOCATION.PALLET_NOT_FOUND'),
            visibilityTime: 3000,
            position: 'bottom'
          });
        }
      }

      // on api error
      if (!getPalletInfoApi.isWaiting && getPalletInfoApi.error) {
        Toast.show({
          type: 'error',
          text1: strings('PALLET.PALLET_DETAILS_ERROR'),
          text2: strings('GENERICS.TRY_AGAIN'),
          visibilityTime: 4000,
          position: 'bottom'
        });
      }
    }
  }, [getPalletInfoApi]);

  if (getPalletInfoApi.isWaiting) {
    return (
      <ActivityIndicator
        animating={getPalletInfoApi.isWaiting}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }

  return (
    <View style={styles.scanContainer}>
      <TouchableOpacity onPress={() => openCamera()}>
        <Icon size={100} name="barcode-scan" color={COLOR.BLACK} />
      </TouchableOpacity>
      <View style={styles.scanText}>
        <Text>{strings('PALLET.SCAN_PALLET')}</Text>
      </View>
      <View style={styles.orText}>
        <Text>{strings('GENERICS.OR')}</Text>
      </View>
      <View style={styles.textView}>
        <TextInput
          value={searchText}
          onChangeText={(text: string) => setSearchText(text.replace(nonNumRegex, ''))}
          style={styles.textInput}
          keyboardType="numeric"
          placeholder={strings('PALLET.ENTER_PALLET_ID')}
          onSubmitEditing={() => onSubmit(searchText, dispatch)}
        />
      </View>
    </View>
  );
};

const PalletManagement = (): JSX.Element => {
  const getPalletInfoApi = useTypedSelector(
    state => state.async.getPalletInfo
  );
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  return (
    <PalletManagementScreen
      useEffectHook={useEffect}
      searchText={searchText}
      setSearchText={setSearchText}
      getPalletInfoApi={getPalletInfoApi}
      navigation={navigation}
      route={route}
      dispatch={dispatch}
    />
  );
};

export default PalletManagement;
