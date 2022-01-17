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
import COLOR from '../../themes/Color';
import styles from './PalletManagement.style';
import { strings } from '../../locales';
import { barcodeEmitter, openCamera } from '../../utils/scannerUtils';
import { validateSession } from '../../utils/sessionTimeout';
import { getPalletDetails } from '../../state/actions/saga';
import { AsyncState } from '../../models/AsyncState';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { trackEvent } from '../../utils/AppCenterTool';
import {
  setPalletInfo,
  setPalletItems
} from '../../state/actions/PalletManagement';

interface PalletManagementProps {
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  dispatch: Dispatch<any>;
  getPalletDetailsApi: AsyncState;
}
const palletIDRegex = new RegExp(/^[0-9]+$/);
const nonNumRegex = new RegExp(/[^0-9]/g);
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
    getPalletDetailsApi
  } = props;
  let scannedSubscription: EmitterSubscription;
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
          // TODO Replace getPalletDetails with /{palletId} endpoint i
          dispatch(getPalletDetails({ palletIds: [scan.value] }));
        });
      }
    });
    return () => {
      scannedSubscription.remove();
    };
  }, []);

  // GetPalletUpcs Api
  useEffectHook(() => {
    // on api success
    if (!getPalletDetailsApi.isWaiting && getPalletDetailsApi.result) {
      const palletDetails = getPalletDetailsApi.result.data.pallets[0];
      // Navigate to ManagePallet
      dispatch(setPalletItems(palletDetails.items));
      dispatch(setPalletInfo(palletDetails));
    }
    if (getPalletDetailsApi.isWaiting && getPalletDetailsApi.error) {
      // react-native-toast-message
    }
  }, [getPalletDetailsApi]);

  if (getPalletDetailsApi.isWaiting) {
    return (
      <ActivityIndicator
        animating={getPalletDetailsApi.isWaiting}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }
  const onSubmit = () => {
    if (searchText.match(palletIDRegex)) {
      dispatch(
        getPalletDetails({ palletIds: [Number.parseInt(searchText, 10)] })
      );
    }
  };
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
          onChangeText={(text: string) => setSearchText(text.replace(nonNumRegex, ''))} // add regex
          style={styles.textInput}
          keyboardType="numeric"
          placeholder={strings('PALLET.ENTER_PALLET_ID')}
          onSubmitEditing={onSubmit}
        />
      </View>
    </View>
  );
};

const PalletManagement = (): JSX.Element => {
  const getPalletDetailsApi = useTypedSelector(
    state => state.async.getPalletDetails
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
      getPalletDetailsApi={getPalletDetailsApi}
      navigation={navigation}
      route={route}
      dispatch={dispatch}
    />
  );
};

export default PalletManagement;
