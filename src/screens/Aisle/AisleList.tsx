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
import { deleteZone, getAisle } from '../../state/actions/saga';
import { trackEvent } from '../../utils/AppCenterTool';
import { validateSession } from '../../utils/sessionTimeout';
import { AsyncState } from '../../models/AsyncState';
import COLOR from '../../themes/Color';
import { LocationType } from '../../models/LocationType';
import { barcodeEmitter } from '../../utils/scannerUtils';
import { setManualScan, setScannedEvent } from '../../state/actions/Global';
import LocationManualScan from '../../components/LocationManualScan/LocationManualScan';
import { hideLocationPopup, setAisles, setCreateFlow } from '../../state/actions/Location';
import BottomSheetAddCard from '../../components/BottomSheetAddCard/BottomSheetAddCard';
import BottomSheetRemoveCard from '../../components/BottomSheetRemoveCard/BottomSheetRemoveCard';
import Button from '../../components/buttons/Button';
import { CustomModalComponent } from '../Modal/Modal';
import { CREATE_FLOW } from '../../models/LocationItems';
import { showSnackBar } from '../../state/actions/SnackBar';

const NoAisleMessage = (): JSX.Element => (
  <View style={styles.noAisles}>
    <Text style={styles.noAislesText}>{strings('LOCATION.NO_AISLES_AVAILABLE')}</Text>
  </View>
);

export const handleModalClose = (
  setDisplayConfirmation: React.Dispatch<React.SetStateAction<boolean>>,
  setDeleteZoneApiStart: React.Dispatch<React.SetStateAction<number>>,
  dispatch: Dispatch<any>
): void => {
  setDisplayConfirmation(false);
  setDeleteZoneApiStart(0);
  dispatch({ type: 'API/DELETE_ZONE/RESET' });
};

export const deleteZoneApiEffect = (
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  deleteZoneApi: AsyncState,
  deleteZoneApiStart: number,
  setDeleteZoneApiStart: React.Dispatch<React.SetStateAction<number>>,
  setDisplayConfirmation: React.Dispatch<React.SetStateAction<boolean>>,
  trackApiEvent: (eventName: string, params?: any) => void
): void => {
  if (navigation.isFocused() && !deleteZoneApi.isWaiting) {
    if (deleteZoneApi.result) {
      // Success
      trackApiEvent('delete_zone_success', {
        duration: moment().valueOf() - deleteZoneApiStart
      });
      handleModalClose(setDisplayConfirmation, setDeleteZoneApiStart, dispatch);
      navigation.goBack();
    }

    if (deleteZoneApi.error) {
      // Failure
      trackApiEvent('delete_zone_fail', {
        duration: moment().valueOf() - deleteZoneApiStart,
        reason: deleteZoneApi.error.message || deleteZoneApi.error.toString()
      });
      dispatch(showSnackBar(strings('LOCATION.REMOVE_ZONE_FAIL'), 3000));
    }
  }
};

interface AisleProps {
  zoneId: number,
  zoneName: string,
  getAllAisles: AsyncState,
  deleteZoneApi: AsyncState,
  isManualScanEnabled: boolean,
  locationPopupVisible: boolean,
  dispatch: Dispatch<any>,
  getAislesApiStart: number,
  setGetAislesApiStart: React.Dispatch<React.SetStateAction<number>>,
  deleteZoneApiStart: number,
  setDeleteZoneApiStart: React.Dispatch<React.SetStateAction<number>>,
  displayConfirmation: boolean,
  setDisplayConfirmation: React.Dispatch<React.SetStateAction<boolean>>,
  navigation: NavigationProp<any>,
  route: RouteProp<any, string>,
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void,
  trackEventCall: (eventName: string, params?: any) => void,
}

export const AisleScreen = (props: AisleProps): JSX.Element => {
  const {
    zoneId,
    zoneName,
    getAllAisles,
    deleteZoneApi,
    isManualScanEnabled,
    locationPopupVisible,
    navigation,
    dispatch,
    getAislesApiStart,
    setGetAislesApiStart,
    deleteZoneApiStart,
    setDeleteZoneApiStart,
    displayConfirmation,
    setDisplayConfirmation,
    route,
    useEffectHook,
    trackEventCall
  } = props;

  // calls to get all aisles
  useEffectHook(() => navigation.addListener('focus', () => {
    validateSession(navigation, route.name).then(() => {
      trackEventCall('get_location_api_call');
      setGetAislesApiStart(moment().valueOf());
      dispatch(getAisle({ zoneId }));
    }).catch(() => { });
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
      trackEventCall('get_aisles_success', { duration: moment().valueOf() - getAislesApiStart });
    }

    // on api failure
    if (!getAllAisles.isWaiting && getAllAisles.error) {
      trackEventCall('get_aisles_failure', {
        errorDetails: getAllAisles.error.message || getAllAisles.error,
        duration: moment().valueOf() - getAislesApiStart
      });
    }
  }, [getAllAisles]);

  useEffectHook(() => deleteZoneApiEffect(
    dispatch,
    navigation,
    deleteZoneApi,
    deleteZoneApiStart,
    setDeleteZoneApiStart,
    setDisplayConfirmation,
    trackEventCall
  ), [deleteZoneApi]);

  const handleDeleteZone = () => {
    setDeleteZoneApiStart(moment().valueOf());
    dispatch(deleteZone(zoneId));
  };

  const deleteZoneModalView = () => (
    <CustomModalComponent
      isVisible={displayConfirmation}
      onClose={() => handleModalClose(setDisplayConfirmation, setDeleteZoneApiStart, dispatch)}
      modalType="Error"
    >
      {deleteZoneApi.isWaiting ? (
        <ActivityIndicator
          animating={deleteZoneApi.isWaiting}
          hidesWhenStopped
          color={COLOR.MAIN_THEME_COLOR}
          size="large"
          style={styles.activityIndicator}
        />
      ) : (
          <>
            <View style={styles.confirmationTextView}>
              <Text style={styles.confirmation}>
                {`${strings('LOCATION.REMOVE_ZONE_CONFIRMATION')}`}
              </Text>
              <Text style={styles.confirmationExtraText}>
                {`${strings('LOCATION.REMOVE_ZONE_WILL_REMOVE_AISLES_SECTIONS')}`}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <Button
                style={styles.delButton}
                title={strings('GENERICS.CANCEL')}
                backgroundColor={COLOR.TRACKER_RED}
                // No need for modal close fn because no apis have been sent
                onPress={() => handleModalClose(setDisplayConfirmation, setDeleteZoneApiStart, dispatch)}
              />
              <Button
                style={styles.delButton}
                title={deleteZoneApi.error ? strings('GENERICS.RETRY') : strings('GENERICS.OK')}
                backgroundColor={COLOR.MAIN_THEME_COLOR}
                onPress={handleDeleteZone}
              />
            </View>
          </>
        )}
    </CustomModalComponent>
  );

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
  const sortAisle = (firstItem: any, secondItem: any) => firstItem.aisleName - secondItem.aisleName;
  const getAisleSorted = () => (getAllAisles.result && getAllAisles.result.data
    && Array.isArray(getAllAisles.result.data) ? getAllAisles.result?.data.sort(sortAisle) : []);
  return (
    <View>
      {deleteZoneModalView()}
      {isManualScanEnabled && <LocationManualScan keyboardType="default" />}
      <LocationHeader
        location={`${strings('LOCATION.ZONE')} ${zoneName}`}
        details={`${getAllAisles.result?.data.length || 0} ${strings('LOCATION.AISLES')}`}
      />
      <FlatList
        data={getAisleSorted()}
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
  const deleteZoneApi = useTypedSelector(state => state.async.deleteZone);
  const { id: zoneId, name: zoneName } = useTypedSelector(state => state.Location.selectedZone);
  const { isManualScanEnabled } = useTypedSelector(state => state.Global);
  const locationPopupVisible = useTypedSelector(state => state.Location.locationPopupVisible);
  const userFeatures = useTypedSelector(state => state.User.features);
  const [getAislesApiStart, setGetAislesApiStart] = useState(0);
  const [deleteZoneApiStart, setDeleteZoneApiStart] = useState(0);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const dispatch = useDispatch();
  const route = useRoute();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const managerSnapPoints = useMemo(() => ['30%'], []);
  const associateSnapPoints = useMemo(() => ['15%'], []);

  useEffect(() => {
    if (navigation.isFocused() && bottomSheetModalRef.current) {
      if (locationPopupVisible) {
        bottomSheetModalRef.current.present();
      } else {
        bottomSheetModalRef.current.dismiss();
      }
    }
  }, [locationPopupVisible]);

  const handleAddAisles = () => {
    dispatch(setAisles(getAllAisles.result.data));
    dispatch(setCreateFlow(CREATE_FLOW.CREATE_AISLE));
    bottomSheetModalRef.current?.dismiss();
    navigation.navigate('AddZone');
  };

  return (
    <BottomSheetModalProvider>
      <TouchableOpacity
        onPress={() => dispatch(hideLocationPopup())}
        activeOpacity={1}
        disabled={!locationPopupVisible}
        style={locationPopupVisible ? styles.disabledContainer : styles.container}
      >
        <AisleScreen
          zoneId={zoneId}
          zoneName={zoneName}
          navigation={navigation}
          dispatch={dispatch}
          getAllAisles={getAllAisles}
          deleteZoneApi={deleteZoneApi}
          isManualScanEnabled={isManualScanEnabled}
          getAislesApiStart={getAislesApiStart}
          setGetAislesApiStart={setGetAislesApiStart}
          deleteZoneApiStart={deleteZoneApiStart}
          setDeleteZoneApiStart={setDeleteZoneApiStart}
          displayConfirmation={displayConfirmation}
          setDisplayConfirmation={setDisplayConfirmation}
          route={route}
          useEffectHook={useEffect}
          trackEventCall={trackEvent}
          locationPopupVisible={locationPopupVisible}
        />
      </TouchableOpacity>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={userFeatures.includes('manager approval') ? managerSnapPoints : associateSnapPoints}
        index={0}
        onDismiss={() => dispatch(hideLocationPopup())}
        style={styles.bottomSheetModal}
      >
        <BottomSheetView>
          <BottomSheetAddCard
            onPress={handleAddAisles}
            text={strings('LOCATION.ADD_AISLES')}
            isManagerOption={false}
            isVisible={true}
          />
          <BottomSheetRemoveCard
            onPress={() => {
              dispatch(hideLocationPopup());
              setDisplayConfirmation(true);
            }}
            text={strings('LOCATION.REMOVE_ZONE')}
            isVisible={userFeatures.includes('manager approval')}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default AisleList;
