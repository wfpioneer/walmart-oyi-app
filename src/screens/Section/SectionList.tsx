import React, {
  EffectCallback,
  useEffect,
  useMemo, useRef,
  useState
} from 'react';
import {
  ActivityIndicator, FlatList, Text, TouchableOpacity, View
} from 'react-native';
import {
  NavigationProp, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import BottomSheetSectionRemoveCard from '../../components/BottomSheetRemoveCard/BottomSheetRemoveCard';
import BottomSheetPrintCard from '../../components/BottomSheetPrintCard/BottomSheetPrintCard';
import BottomSheetClearCard from '../../components/BottomSheetClearCard/BottomSheetClearCard';
import styles from './SectionList.style';
import LocationItemCard from '../../components/LocationItemCard/LocationItemCard';
import { strings } from '../../locales';
import { LocationHeader } from '../../components/locationHeader/LocationHeader';
import { LocationType } from '../../models/LocationType';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { clearAisle, deleteAisle, getSections } from '../../state/actions/saga';
import { trackEvent } from '../../utils/AppCenterTool';
import { validateSession } from '../../utils/sessionTimeout';
import { AsyncState } from '../../models/AsyncState';
import COLOR from '../../themes/Color';
import { setManualScan, setScannedEvent } from '../../state/actions/Global';
import { barcodeEmitter } from '../../utils/scannerUtils';
import LocationManualScan from '../../components/LocationManualScan/LocationManualScan';
import {
  hideLocationPopup,
  setAislesToCreateToExistingAisle,
  setCreateFlow,
  setSections
} from '../../state/actions/Location';
import BottomSheetAddCard from '../../components/BottomSheetAddCard/BottomSheetAddCard';
import { setPrintingLocationLabels } from '../../state/actions/Print';
import { LocationName } from '../../models/Location';
import { CREATE_FLOW } from '../../models/LocationItems';
import { CustomModalComponent } from '../Modal/Modal';
import Button from '../../components/buttons/Button';
import { showSnackBar } from '../../state/actions/SnackBar';
import { SNACKBAR_TIMEOUT } from '../../utils/global';

const NoSectionMessage = (): JSX.Element => (
  <View style={styles.noSections}>
    <Text style={styles.noSectionsText}>{strings('LOCATION.NO_SECTIONS_AVAILABLE')}</Text>
  </View>
);
export const handleModalClose = (
  setDisplayConfirmation: React.Dispatch<React.SetStateAction<boolean>>,
  setDeleteZoneApiStart: React.Dispatch<React.SetStateAction<number>>,
  dispatch: Dispatch<any>
): void => {
  setDisplayConfirmation(false);
  setDeleteZoneApiStart(0);
  dispatch({ type: 'API/DELETE_AISLE/RESET' });
  dispatch({ type: 'API/CLEAR_AISLE/RESET' });
};

interface SectionProps {
  aisleId: number,
  aisleName: string,
  zoneName: string,
  getAllSections: AsyncState,
  isManualScanEnabled: boolean,
  dispatch: Dispatch<any>,
  apiStart: number,
  setApiStart: React.Dispatch<React.SetStateAction<number>>,
  navigation: NavigationProp<any>,
  route: RouteProp<any, string>,
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void,
  trackEventCall: (eventName: string, params?: any) => void,
  locationPopupVisible: boolean,
  displayConfirmation: boolean,
  setDisplayConfirmation: React.Dispatch<React.SetStateAction<boolean>>,
  deleteAisleApi: AsyncState,
  deleteAisleApiStart: number,
  setDeleteAisleApiStart: React.Dispatch<React.SetStateAction<number>>,
  isClearAisle: boolean,
  setIsClearAisle: React.Dispatch<React.SetStateAction<boolean>>,
  clearAisleApi: AsyncState
}

export const SectionScreen = (props: SectionProps): JSX.Element => {
  const {
    aisleId,
    aisleName,
    zoneName,
    getAllSections,
    isManualScanEnabled,
    navigation,
    apiStart,
    dispatch,
    setApiStart,
    route,
    useEffectHook,
    trackEventCall,
    locationPopupVisible,
    displayConfirmation,
    setDisplayConfirmation,
    deleteAisleApi,
    deleteAisleApiStart,
    setDeleteAisleApiStart,
    isClearAisle,
    setIsClearAisle,
    clearAisleApi
  } = props;

  useEffectHook(() => {
    if (navigation.isFocused() && !deleteAisleApi.isWaiting) {
      if (deleteAisleApi.result) {
        // Success
        trackEvent('delete_aisle_success', {
          duration: moment().valueOf() - deleteAisleApiStart
        });
        handleModalClose(setDisplayConfirmation, setDeleteAisleApiStart, dispatch);
        dispatch(showSnackBar(strings('LOCATION.AISLE_REMOVED'), SNACKBAR_TIMEOUT));
        navigation.goBack();
      }
      if (deleteAisleApi.error) {
        // Failure
        trackEvent('delete_aisle_fail', {
          duration: moment().valueOf() - deleteAisleApiStart,
          reason: deleteAisleApi.error.message || deleteAisleApi.error.toString()
        });
        handleModalClose(setDisplayConfirmation, setDeleteAisleApiStart, dispatch);
        dispatch(showSnackBar(strings('LOCATION.REMOVE_AISLE_FAIL'), SNACKBAR_TIMEOUT));
      }
    }
  }, [deleteAisleApi]);

  useEffectHook(() => {
    if (navigation.isFocused() && !clearAisleApi.isWaiting) {
      if (clearAisleApi.result) {
        // Success
        trackEvent('clear_aisle_success', {
          duration: moment().valueOf() - deleteAisleApiStart
        });
        setIsClearAisle(false);
        handleModalClose(setDisplayConfirmation, setDeleteAisleApiStart, dispatch);
        dispatch(showSnackBar(strings('LOCATION.AISLE_CLEARED'), SNACKBAR_TIMEOUT));
      }
      if (clearAisleApi.error) {
        // Failure
        trackEvent('clear_aisle_fail', {
          duration: moment().valueOf() - deleteAisleApiStart,
          reason: clearAisleApi.error.message || clearAisleApi.error.toString()
        });
        handleModalClose(setDisplayConfirmation, setDeleteAisleApiStart, dispatch);
        dispatch(showSnackBar(strings('LOCATION.CLEAR_AISLE_FAIL'), SNACKBAR_TIMEOUT));
      }
    }
  }, [clearAisleApi]);
  // calls to get all sections
  useEffectHook(() => navigation.addListener('focus', () => {
    validateSession(navigation, route.name).then(() => {
      trackEventCall('get_location_api_call');
      setApiStart(moment().valueOf());
      dispatch(getSections({ aisleId }));
    });
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
    if (!getAllSections.isWaiting && getAllSections.result) {
      trackEventCall('get_sections_success', { duration: moment().valueOf() - apiStart });
    }

    // on api failure
    if (!getAllSections.isWaiting && getAllSections.error) {
      trackEventCall('get_sections_failure', {
        errorDetails: getAllSections.error.message || getAllSections.error,
        duration: moment().valueOf() - apiStart
      });
    }
  }, [getAllSections]);

  if (getAllSections.isWaiting) {
    return (
      <ActivityIndicator
        animating={getAllSections.isWaiting}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }

  if (getAllSections.error) {
    return (
      <View style={styles.errorView}>
        <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_300} />
        <Text style={styles.errorText}>{strings('LOCATION.LOCATION_API_ERROR')}</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => {
            trackEventCall('location_api_retry',);
            dispatch(getSections({ aisleId }));
          }}
        >
          <Text>{strings('GENERICS.RETRY')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDeleteAisle = () => {
    setDeleteAisleApiStart(moment().valueOf());
    dispatch(
      deleteAisle({
        aisleId
      })
    );
  };
  const handleClearAisle = () => {
    setDeleteAisleApiStart(moment().valueOf());
    dispatch(
      clearAisle({
        aisleId,
        clearTarget: 'items-and-pallets'
      })
    );
  };
  const deleteSectionModalView = () => (
    <CustomModalComponent
      isVisible={displayConfirmation}
      onClose={() => setDisplayConfirmation(false)}
      modalType="Error"
    >
      {clearAisleApi.isWaiting || deleteAisleApi.isWaiting ? (
        <ActivityIndicator
          animating={isClearAisle ? clearAisleApi.isWaiting : deleteAisleApi.isWaiting}
          hidesWhenStopped
          color={COLOR.MAIN_THEME_COLOR}
          size="large"
          style={styles.activityIndicator}
        />
      ) : (
        <>
          <View style={styles.confirmationTextView}>
            <Text style={styles.confirmation}>
              {isClearAisle ? `${strings('LOCATION.CLEAR_AISLE_CONFIRMATION')}`
                : `${strings('LOCATION.REMOVE_AISLE_CONFIRMATION')}`}
            </Text>
            <Text style={styles.confirmationExtraText}>
              {isClearAisle ? `${strings('LOCATION.CLEAR_AISLE_WILL_REMOVE_SECTIONS')}`
                : `${strings('LOCATION.REMOVE_AISLE_WILL_REMOVE_SECTIONS')}`}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              style={styles.delButton}
              title={strings('GENERICS.CANCEL')}
              backgroundColor={COLOR.MAIN_THEME_COLOR}
                // No need for modal close fn because no apis have been sent
              onPress={() => setDisplayConfirmation(false)}
            />
            <Button
              style={styles.delButton}
              title={strings('GENERICS.OK')}
              backgroundColor={COLOR.TRACKER_RED}
              onPress={isClearAisle ? handleClearAisle : handleDeleteAisle}
            />
          </View>
        </>
      )}
    </CustomModalComponent>
  );
  return (
    <View>
      {deleteSectionModalView()}
      {isManualScanEnabled && <LocationManualScan keyboardType="default" />}
      <LocationHeader
        location={`${strings('LOCATION.AISLE')} ${zoneName}${aisleName}`}
        details={`${getAllSections.result?.data.length || 0} ${strings('LOCATION.SECTIONS')}`}
      />
      <FlatList
        data={getAllSections.result?.data || []}
        renderItem={({ item }) => (
          <LocationItemCard
            location={`${strings('LOCATION.SECTION')} ${zoneName}${aisleName}-${item.sectionName}`}
            locationId={item.sectionId}
            locationName={item.sectionName}
            locationType={LocationType.SECTION}
            dispatch={dispatch}
            locationDetails=""
            navigator={navigation}
            destinationScreen={LocationType.SECTION_DETAILS}
            locationPopupVisible={locationPopupVisible}
          />
        )}
        keyExtractor={item => item.sectionName}
        ListEmptyComponent={<NoSectionMessage />}
        contentContainerStyle={styles.contentPadding}
      />
    </View>
  );
};

const SectionList = (): JSX.Element => {
  const navigation = useNavigation();
  const getAllSections = useTypedSelector(state => state.async.getSections);
  const { id: aisleId, name: aisleName } = useTypedSelector(state => state.Location.selectedAisle);
  const { name: zoneName } = useTypedSelector(state => state.Location.selectedZone);
  const location = useTypedSelector(state => state.Location);
  const { isManualScanEnabled } = useTypedSelector(state => state.Global);
  const userFeatures = useTypedSelector(state => state.User.features);
  const [apiStart, setApiStart] = useState(0);
  const dispatch = useDispatch();
  const route = useRoute();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const managerSnapPoints = useMemo(() => ['60%'], []);
  const associateSnapPoints = useMemo(() => ['30%'], []);
  const deleteAisleApi = useTypedSelector(state => state.async.deleteAisle);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [isClearAisle, setIsClearAisle] = useState(false);
  const [deleteAisleApiStart, setDeleteAisleApiStart] = useState(0);
  const clearAisleApi = useTypedSelector(state => state.async.clearAisle);

  useEffect(() => {
    if (navigation.isFocused() && bottomSheetModalRef.current) {
      if (location.locationPopupVisible) {
        bottomSheetModalRef.current.present();
      } else {
        bottomSheetModalRef.current.dismiss();
      }
    }
  }, [location]);

  const handleAddSections = () => {
    dispatch(setSections(getAllSections.result.data));
    dispatch(setCreateFlow(CREATE_FLOW.CREATE_SECTION));
    dispatch(setAislesToCreateToExistingAisle({ id: aisleId, name: aisleName }));
    bottomSheetModalRef.current?.dismiss();
    navigation.navigate('AddSection');
  };

  return (
    <BottomSheetModalProvider>
      <TouchableOpacity
        onPress={() => dispatch(hideLocationPopup())}
        activeOpacity={1}
        disabled={!location.locationPopupVisible}
        style={location.locationPopupVisible ? styles.disabledContainer : styles.container}
      >
        <SectionScreen
          aisleId={aisleId}
          aisleName={aisleName}
          zoneName={zoneName}
          navigation={navigation}
          dispatch={dispatch}
          getAllSections={getAllSections}
          isManualScanEnabled={isManualScanEnabled}
          apiStart={apiStart}
          setApiStart={setApiStart}
          route={route}
          useEffectHook={useEffect}
          trackEventCall={trackEvent}
          locationPopupVisible={location.locationPopupVisible}
          displayConfirmation={displayConfirmation}
          setDisplayConfirmation={setDisplayConfirmation}
          deleteAisleApi={deleteAisleApi}
          deleteAisleApiStart={deleteAisleApiStart}
          setDeleteAisleApiStart={setDeleteAisleApiStart}
          isClearAisle={isClearAisle}
          setIsClearAisle={setIsClearAisle}
          clearAisleApi={clearAisleApi}
        />
      </TouchableOpacity>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={userFeatures.includes('manager approval') ? managerSnapPoints : associateSnapPoints}
        index={0}
        onDismiss={() => dispatch(hideLocationPopup())}
        style={styles.bottomSheetModal}
      >
        <BottomSheetPrintCard
          isVisible={userFeatures.includes('location printing')}
          text={strings('LOCATION.PRINT_SECTION')}
          onPress={() => {
            dispatch(hideLocationPopup());
            bottomSheetModalRef.current?.dismiss();
            dispatch(setPrintingLocationLabels(LocationName.AISLE));
            navigation.navigate('PrintPriceSign');
          }}
        />
        <BottomSheetAddCard
          isVisible={true}
          text={strings('LOCATION.ADD_SECTIONS')}
          onPress={handleAddSections}
        />
        <BottomSheetClearCard
          isVisible={userFeatures.includes('manager approval')}
          text={strings('LOCATION.CLEAR_AISLE')}
          onPress={() => {
            dispatch(hideLocationPopup());
            setDisplayConfirmation(true);
            setIsClearAisle(true);
          }}
        />
        <BottomSheetSectionRemoveCard
          isVisible={userFeatures.includes('manager approval')}
          text={strings('LOCATION.REMOVE_AISLE')}
          onPress={() => {
            dispatch(hideLocationPopup());
            setDisplayConfirmation(true);
          }}
        />
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default SectionList;
