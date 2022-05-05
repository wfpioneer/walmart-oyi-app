import React, { Dispatch, EffectCallback, useEffect } from 'react';
import {
  ActivityIndicator, Text, TouchableOpacity, View
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FlatList } from 'react-native-gesture-handler';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { strings } from '../../locales';
import { LocationItem, ReserveDetailsPallet, SectionDetailsPallet } from '../../models/LocationItems';
import { getPalletDetails } from '../../state/actions/saga';
import { AsyncState } from '../../models/AsyncState';
import styles from './SectionDetailsScreen.style';
import COLOR from '../../themes/Color';
import { trackEvent } from '../../utils/AppCenterTool';
import { GET_PALLET_DETAILS } from '../../state/actions/asyncAPI';
import ReservePalletRow from '../../components/ReservePalletRow/ReservePalletRow';
import { showSnackBar } from '../../state/actions/SnackBar';

interface ReserveSectionDetailsProps {
  getSectionDetailsApi: AsyncState;
  getPalletDetailsApi: AsyncState;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  trackEventCall: (eventName: string, params?: any) => void;
  useEffectHook: (effect: EffectCallback, deps?:ReadonlyArray<any>) => void;
  palletIds: string[];
}
// Combines the Reserve Response data from the get pallet/sectionDetails api to display creation date.
export const combineReserveArrays = (
  reserveDetails?: ReserveDetailsPallet[], palletData?: Omit<SectionDetailsPallet, 'items'>[]
): ReserveDetailsPallet[] => {
  let palletDetails: ReserveDetailsPallet[] = [];
  if (reserveDetails && palletData) {
    palletDetails = reserveDetails.map(pallet => {
      const sectionReserve = palletData.find(loc => loc.palletId === pallet.id.toString());
      return { ...pallet, ...sectionReserve };
    });
  }
  return palletDetails;
};

export const ReserveSectionDetailsScreen = (props: ReserveSectionDetailsProps) : JSX.Element => {
  const {
    getSectionDetailsApi,
    getPalletDetailsApi,
    dispatch,
    navigation,
    trackEventCall,
    useEffectHook,
    palletIds
  } = props;
  const locationItem: LocationItem | undefined = (getSectionDetailsApi.result && getSectionDetailsApi.result.data)
  || undefined;
  const reservePallets: ReserveDetailsPallet[] | undefined = (
    getPalletDetailsApi.result && getPalletDetailsApi.result.data.pallets);

  // Navigation Listener
  useEffectHook(() => {
    // Resets Get PalletDetails api response data when navigating off-screen
    navigation.addListener('beforeRemove', () => {
      dispatch({ type: GET_PALLET_DETAILS.RESET });
    });
  }, []);

  // Get Pallet Details Api
  useEffectHook(() => {
    // on api success
    if (!getPalletDetailsApi.isWaiting && getPalletDetailsApi.result) {
      const failedPallets = reservePallets?.filter(pallet => pallet.statusCode !== 200).length;
      // Update Location State on Success
      if (getPalletDetailsApi.result.status === 207) {
        // Display toast message
        dispatch(showSnackBar(strings('LOCATION.GET_FAILED_PALLETS', { amount: failedPallets }), 5000));
      }
    }
  }, [getPalletDetailsApi]);

  if (getPalletDetailsApi.isWaiting || getSectionDetailsApi.isWaiting) {
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

  if (getPalletDetailsApi.error) {
    return (
      <View style={styles.errorView}>
        <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_300} />
        <Text style={styles.errorText}>{strings('LOCATION.LOCATION_API_ERROR')}</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => {
            trackEventCall('location_api_retry',);
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
        data={combineReserveArrays(reservePallets, locationItem?.pallets.palletData)}
        renderItem={({ item }) => (
          // Resolves type error, Section Id will never be zero in our case
          <ReservePalletRow section={locationItem?.section || { id: 0, name: '' }} reservePallet={item} />
        )}
        keyExtractor={(item, idx) => `${item.id}${idx}`}
        ListEmptyComponent={(
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcon name="information" size={40} color={COLOR.DISABLED_BLUE} />
            <Text>{strings('LOCATION.RESERVE_EMPTY')}</Text>
          </View>
        )}
      />
    </View>
  );
};

const ReserveSectionDetails = (): JSX.Element => {
  const getSectionDetailsApi = useTypedSelector(state => state.async.getSectionDetails);
  const getPalletDetailsApi = useTypedSelector(state => state.async.getPalletDetails);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { palletIds } = useTypedSelector(state => state.Location);
  return (
    <>
      <ReserveSectionDetailsScreen
        getSectionDetailsApi={getSectionDetailsApi}
        getPalletDetailsApi={getPalletDetailsApi}
        dispatch={dispatch}
        navigation={navigation}
        trackEventCall={trackEvent}
        useEffectHook={useEffect}
        palletIds={palletIds}
      />
    </>
  );
};

export default ReserveSectionDetails;
