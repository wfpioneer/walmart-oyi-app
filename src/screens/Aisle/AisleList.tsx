import React, {
  EffectCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  ActivityIndicator, FlatList, Text, TouchableOpacity, View
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  NavigationProp, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import styles from './AisleList.style';
import LocationItemCard from '../../components/LocationItemCard/LocationItemCard';
import { strings } from '../../locales';
import { LocationHeader } from '../../components/locationHeader/LocationHeader';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { getAisle } from '../../state/actions/saga';
import { trackEvent } from '../../utils/AppCenterTool';
import { validateSession } from '../../utils/sessionTimeout';
import { AsyncState } from '../../models/AsyncState';
import COLOR from '../../themes/Color';
import { LocationType } from '../../models/LocationType';
import { barcodeEmitter } from '../../utils/scannerUtils';
import { setManualScan, setScannedEvent } from '../../state/actions/Global';
import LocationManualScan from '../../components/LocationManualScan/LocationManualScan';
import { hideLocationPopup } from '../../state/actions/Location';
import BottomSheetAddCard from '../../components/BottomSheetAddCard/BottomSheetAddCard';
import BottomSheetRemoveCard from '../../components/BottomSheetRemoveCard/BottomSheetRemoveCard';

const NoAisleMessage = () : JSX.Element => (
  <View style={styles.noAisles}>
    <Text style={styles.noAislesText}>{strings('LOCATION.NO_AISLES_AVAILABLE')}</Text>
  </View>
);

interface AisleProps {
    zoneId: number,
    zoneName: string,
    getAllAisles: AsyncState,
    isManualScanEnabled: boolean,
    locationPopupVisible: boolean,
    dispatch: Dispatch<any>,
    apiStart: number,
    setApiStart: React.Dispatch<React.SetStateAction<number>>,
    navigation: NavigationProp<any>,
    route: RouteProp<any, string>,
    useEffectHook: (effect: EffectCallback, deps?:ReadonlyArray<any>) => void,
    trackEventCall: (eventName: string, params?: any) => void,
}

export const AisleScreen = (props: AisleProps) : JSX.Element => {
  const {
    zoneId,
    zoneName,
    getAllAisles,
    isManualScanEnabled,
    locationPopupVisible,
    navigation,
    apiStart,
    dispatch,
    setApiStart,
    route,
    useEffectHook,
    trackEventCall
  } = props;

  // calls to get all aisles
  useEffectHook(() => navigation.addListener('focus', () => {
    validateSession(navigation, route.name).then(() => {
      trackEventCall('get_location_api_call');
      setApiStart(moment().valueOf());
      dispatch(getAisle({ zoneId }));
    }).catch(() => {});
  }), [navigation]);

  // scanned event listener
  useEffectHook(() => {
    const scanSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        validateSession(navigation, route.name).then(() => {
          trackEventCall('section_details_scan', { value: scan.value, type: scan.type });
          dispatch(setScannedEvent(scan));
          dispatch(setManualScan(false));
          navigation.navigate('SectionDetails');
        });
      }
    });
    return () => {
      scanSubscription.remove();
    };
  }, []);

  useEffectHook(() => {
    // on api success
    if (!getAllAisles.isWaiting && getAllAisles.result) {
      trackEventCall('get_aisles_success', { duration: moment().valueOf() - apiStart });
    }

    // on api failure
    if (!getAllAisles.isWaiting && getAllAisles.error) {
      trackEventCall('get_aisles_failure', {
        errorDetails: getAllAisles.error.message || getAllAisles.error,
        duration: moment().valueOf() - apiStart
      });
    }
  }, [getAllAisles]);

  if (getAllAisles.isWaiting) {
    return (
      <ActivityIndicator
        animating={getAllAisles.isWaiting}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }

  if (getAllAisles.error) {
    return (
      <View style={styles.errorView}>
        <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_300} />
        <Text style={styles.errorText}>{strings('LOCATION.LOCATION_API_ERROR')}</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => {
            trackEventCall('location_api_retry',);
            dispatch(getAisle({ zoneId }));
          }}
        >
          <Text>{strings('GENERICS.RETRY')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
      {isManualScanEnabled && <LocationManualScan keyboardType="default" />}
      <LocationHeader
        location={`${strings('LOCATION.ZONE')} ${zoneName}`}
        details={`${getAllAisles.result?.data.length || 0} ${strings('LOCATION.AISLES')}`}
        navigation={navigation}
        route={route}
      />
      <FlatList
        data={getAllAisles.result?.data || []}
        renderItem={({ item }) => (
          <LocationItemCard
            location={`${strings('LOCATION.AISLE')} ${zoneName}${item.aisleName}`}
            locationId={item.aisleId}
            locationName={item.aisleName}
            locationType={LocationType.AISLE}
            locationDetails={`${item.sectionCount} ${strings('LOCATION.SECTIONS')}`}
            navigator={navigation}
            destinationScreen={LocationType.SECTION}
            dispatch={dispatch}
            locationPopupVisible={locationPopupVisible}
          />
        )}
        keyExtractor={item => item.aisleName}
        ListEmptyComponent={<NoAisleMessage />}
        contentContainerStyle={styles.contentPadding}
      />
    </View>
  );
};

const AisleList = (): JSX.Element => {
  const navigation = useNavigation();
  const getAllAisles = useTypedSelector(state => state.async.getAisle);
  const { id: zoneId, name: zoneName } = useTypedSelector(state => state.Location.selectedZone);
  const { isManualScanEnabled } = useTypedSelector(state => state.Global);
  const locationPopupVisible = useTypedSelector(state => state.Location.locationPopupVisible);
  const userFeatures = useTypedSelector(state => state.User.features);
  const [apiStart, setApiStart] = useState(0);
  const dispatch = useDispatch();
  const route = useRoute();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['33%', '50%'], []);

  useEffect(() => {
    if (navigation.isFocused()) {
      if (locationPopupVisible) {
        bottomSheetModalRef.current?.present();
      } else {
        bottomSheetModalRef.current?.dismiss();
      }
    }
  }, [locationPopupVisible]);

  return (
    <BottomSheetModalProvider>
      <TouchableOpacity
        onPress={() => dispatch(hideLocationPopup())}
        activeOpacity={1}
        disabled={!locationPopupVisible}
        style={styles.container}
      >
        <AisleScreen
          zoneId={zoneId}
          zoneName={zoneName}
          navigation={navigation}
          dispatch={dispatch}
          getAllAisles={getAllAisles}
          isManualScanEnabled={isManualScanEnabled}
          apiStart={apiStart}
          setApiStart={setApiStart}
          route={route}
          useEffectHook={useEffect}
          trackEventCall={trackEvent}
          locationPopupVisible={locationPopupVisible}
        />
      </TouchableOpacity>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        index={0}
        onDismiss={() => dispatch(hideLocationPopup())}
        style={styles.bottomSheetModal}
      >
        <BottomSheetView>
          <BottomSheetAddCard
            onPress={() => {}}
            text={strings('LOCATION.ADD_AISLES')}
            isManagerOption={false}
            isVisible={true}
          />
          <BottomSheetRemoveCard
            onPress={() => {}}
            text={strings('LOCATION.REMOVE_AREA')}
            isVisible={userFeatures.includes('manager approval')}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default AisleList;
