import React, {
  DependencyList,
  Dispatch,
  EffectCallback,
  JSX,
  useCallback,
  useEffect,
  useState
} from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation
} from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FlatList } from 'react-native-gesture-handler';
import {
  Pallet,
  PalletInfo,
  PalletItem
} from '../../models/PalletManagementTypes';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { strings } from '../../locales';
import {
  LocationItem,
  ReserveDetailsPallet,
  SectionDetailsPallet
} from '../../models/LocationItems';
import { getPalletDetails } from '../../state/actions/saga';
import { AsyncState } from '../../models/AsyncState';
import styles from './SectionDetailsScreen.style';
import COLOR from '../../themes/Color';
import { trackEvent } from '../../utils/AppCenterTool';
import { GET_PALLET_DETAILS } from '../../state/actions/asyncAPI';
import {
  setPerishableCategories,
  setupPallet
} from '../../state/actions/PalletManagement';
import ReservePalletRow from '../../components/ReservePalletRow/ReservePalletRow';
import { SNACKBAR_TIMEOUT, SNACKBAR_TIMEOUT_LONG } from '../../utils/global';
import { setIsToolBarNavigation } from '../../state/actions/Location';

interface ReserveSectionDetailsProps {
  getSectionDetailsApi: AsyncState;
  getPalletDetailsApi: AsyncState;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  trackEventCall: (eventName: string, params?: any) => void;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  palletIds: string[];
  configComplete: boolean;
  setConfigComplete: React.Dispatch<React.SetStateAction<boolean>>;
  getPalletDetailsComplete: boolean;
  setGetPalletDetailsComplete: React.Dispatch<React.SetStateAction<boolean>>;
  palletClicked: boolean;
  setPalletClicked: React.Dispatch<React.SetStateAction<boolean>>;
  useFocusEffectHook: (effect: EffectCallback) => void;
  useCallbackHook: <T extends (...args: any[]) => any>(
    callback: T,
    deps: DependencyList
  ) => T;
  palletInfo: PalletInfo;
  perishableCategoriesList: number[];
  perishableCategories: string;
}
// Combines the Reserve Response data from the get pallet/sectionDetails api to display creation date.
export const combineReserveArrays = (
  reserveDetails?: ReserveDetailsPallet[],
  palletData?: Omit<SectionDetailsPallet, 'items'>[]
): ReserveDetailsPallet[] => {
  let palletDetails: ReserveDetailsPallet[] = [];
  if (reserveDetails && palletData) {
    palletDetails = reserveDetails.map(pallet => {
      const sectionReserve = palletData.find(
        loc => loc.palletId === pallet.id.toString()
      );
      return { ...pallet, ...sectionReserve };
    });
  }
  return palletDetails;
};

export const showActivitySpinner = (
  getPalletDetailsWaiting: boolean,
  getPalletDetailsComplete: boolean,
  getSectionDetailsWaiting: boolean
) =>
  getPalletDetailsWaiting ||
  getSectionDetailsWaiting ||
  getPalletDetailsComplete;

export const navListenerHook = (
  navigation: NavigationProp<any>,
  dispatch: Dispatch<any>
) => {
  // Resets Get PalletDetails api response data when navigating off-screen
  navigation.addListener('beforeRemove', () => {
    dispatch({ type: GET_PALLET_DETAILS.RESET });
  });
};

export const setPerishableCategoriesHook = (
  perishableCategoriesList: number[],
  perishableCategories: string,
  dispatch: Dispatch<any>,
  setConfigComplete: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (perishableCategoriesList.length === 0) {
    const backupPerishableCategories = perishableCategories
      .split('-')
      .map(Number);
    dispatch(setPerishableCategories(backupPerishableCategories));
    setConfigComplete(true);
  }
};

export const navigateToPalletManagementHook = (
  configComplete: boolean,
  getPalletDetailsComplete: boolean,
  trackEventCall: (eventName: string, params?: any) => void,
  palletInfo: PalletInfo,
  navigation: NavigationProp<any>,
  setGetPalletDetailsComplete: React.Dispatch<React.SetStateAction<boolean>>,
  dispatch: Dispatch<any>
) => {
  if (navigation.isFocused()) {
    if (configComplete && getPalletDetailsComplete) {
      trackEventCall('Section_Details', {
        action: 'navigating_to_manage_pallet_screen',
        palletId: palletInfo.id
      });
      navigation.navigate('PalletManagement', { screen: 'ManagePallet' });
      setGetPalletDetailsComplete(false);
      dispatch(setIsToolBarNavigation(false));
    }
  }
};

export const getPalletDetailsApiHook = (
  getPalletDetailsApi: AsyncState,
  reservePallets: ReserveDetailsPallet[] | undefined,
  palletClicked: boolean,
  setPalletClicked: React.Dispatch<React.SetStateAction<boolean>>,
  dispatch: Dispatch<any>,
  setGetPalletDetailsComplete: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // on api success
  if (!getPalletDetailsApi.isWaiting && getPalletDetailsApi.result) {
    if (getPalletDetailsApi.result.status === 200 && palletClicked) {
      const { id, createDate, expirationDate, items } =
        getPalletDetailsApi.result.data.pallets[0];
      setPalletClicked(false);
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
      setGetPalletDetailsComplete(true);
    } else if (getPalletDetailsApi.result.status === 207) {
      const failedPallets = reservePallets?.filter(
        pallet => pallet.statusCode !== 200
      ).length;
      // Display toast message
      Toast.show({
        type: 'error',
        text1: strings('LOCATION.GET_FAILED_PALLETS', {
          amount: failedPallets
        }),
        visibilityTime: SNACKBAR_TIMEOUT_LONG,
        position: 'bottom'
      });
    } else if (getPalletDetailsApi.result.status === 204) {
      Toast.show({
        type: 'error',
        text1: strings('LOCATION.PALLET_NOT_FOUND'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
    }
  }

  // on api error
  if (!getPalletDetailsApi.isWaiting && getPalletDetailsApi.error) {
    Toast.show({
      type: 'error',
      text1: strings('PALLET.PALLET_DETAILS_ERROR'),
      text2: strings('GENERICS.TRY_AGAIN'),
      visibilityTime: SNACKBAR_TIMEOUT,
      position: 'bottom'
    });
  }
};

export const ReserveSectionDetailsScreen = (
  props: ReserveSectionDetailsProps
): JSX.Element => {
  const {
    getSectionDetailsApi,
    getPalletDetailsApi,
    dispatch,
    navigation,
    trackEventCall,
    useEffectHook,
    palletIds,
    getPalletDetailsComplete,
    setPalletClicked,
    palletClicked,
    setConfigComplete,
    configComplete,
    setGetPalletDetailsComplete,
    useFocusEffectHook,
    useCallbackHook,
    palletInfo,
    perishableCategoriesList,
    perishableCategories
  } = props;
  const locationItem: LocationItem | undefined = (getSectionDetailsApi.result && getSectionDetailsApi.result.data)
  || undefined;
  const reservePallets: ReserveDetailsPallet[] | undefined = (
    getPalletDetailsApi.result && getPalletDetailsApi.result.data.pallets);
  const sortPallets = (a: ReserveDetailsPallet, b: ReserveDetailsPallet) => Number(a.id) - Number(b.id);
  const palletsList:ReserveDetailsPallet[] = combineReserveArrays(
    reservePallets,
    locationItem?.pallets.palletData
  ).sort(sortPallets);

  useEffectHook(() => navListenerHook(navigation, dispatch), []);

  useFocusEffectHook(
    useCallbackHook(() => {
      setPerishableCategoriesHook(
        perishableCategoriesList,
        perishableCategories,
        dispatch,
        setConfigComplete
      );
    }, [navigation])
  );

  // Get Pallet Details Api
  useEffectHook(() => {
    if (navigation.isFocused()) {
      getPalletDetailsApiHook(
        getPalletDetailsApi,
        reservePallets,
        palletClicked,
        setPalletClicked,
        dispatch,
        setGetPalletDetailsComplete
      );
    }
  }, [getPalletDetailsApi]);

  useEffectHook(() => {
    navigateToPalletManagementHook(
      configComplete,
      getPalletDetailsComplete,
      trackEventCall,
      palletInfo,
      navigation,
      setGetPalletDetailsComplete,
      dispatch
    );
  }, [getPalletDetailsComplete, configComplete]);

  if (
    showActivitySpinner(
      getPalletDetailsApi.isWaiting,
      getPalletDetailsComplete,
      getSectionDetailsApi.isWaiting
    )
  ) {
    return (
      <ActivityIndicator
        animating={true}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }

  if (getPalletDetailsApi.error) {
    return (
      <View style={styles.errorView}>
        <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_300} />
        <Text style={styles.errorText}>
          {strings('LOCATION.LOCATION_API_ERROR')}
        </Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => {
            trackEventCall('location_api_retry');
            dispatch(getPalletDetails({ palletIds }));
          }}
        >
          <Text>{strings('GENERICS.RETRY')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.locDetailsScreenContainer}>
      <FlatList
        data={palletsList}
        renderItem={({ item }) => (
          // Resolves type error, Section Id will never be zero in our case
          <ReservePalletRow
            section={locationItem?.section || { id: 0, name: '' }}
            reservePallet={item}
            setPalletClicked={setPalletClicked}
            trackEventCall={trackEvent}
          />
        )}
        keyExtractor={(item, idx) => `${item.id}${idx}`}
        ListEmptyComponent={(
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcon
              name="information"
              size={40}
              color={COLOR.DISABLED_BLUE}
            />
            <Text>{strings('LOCATION.RESERVE_EMPTY')}</Text>
          </View>
       )}
      />
    </View>
  );
};

const ReserveSectionDetails = (): JSX.Element => {
  const getSectionDetailsApi = useTypedSelector(
    state => state.async.getSectionDetails
  );
  const getPalletDetailsApi = useTypedSelector(
    state => state.async.getPalletDetails
  );
  const { palletInfo, perishableCategoriesList } = useTypedSelector(
    state => state.PalletManagement
  );
  const userConfig = useTypedSelector(state => state.User.configs);
  const [configComplete, setConfigComplete] = useState(false);
  const [getPalletDetailsComplete, setGetPalletDetailsComplete] =
    useState(false);
  const [palletClicked, setPalletClicked] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { palletIds } = useTypedSelector(state => state.Location);
  const { perishableCategories } = userConfig;
  return (
    <ReserveSectionDetailsScreen
      getSectionDetailsApi={getSectionDetailsApi}
      getPalletDetailsApi={getPalletDetailsApi}
      dispatch={dispatch}
      navigation={navigation}
      trackEventCall={trackEvent}
      useEffectHook={useEffect}
      palletIds={palletIds}
      configComplete={configComplete}
      setConfigComplete={setConfigComplete}
      getPalletDetailsComplete={getPalletDetailsComplete}
      setGetPalletDetailsComplete={setGetPalletDetailsComplete}
      palletClicked={palletClicked}
      setPalletClicked={setPalletClicked}
      useFocusEffectHook={useFocusEffect}
      useCallbackHook={useCallback}
      palletInfo={palletInfo}
      perishableCategoriesList={perishableCategoriesList}
      perishableCategories={perishableCategories}
    />
  );
};

export default ReserveSectionDetails;
