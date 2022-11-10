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
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import BottomSheetSectionRemoveCard from '../../components/BottomSheetRemoveCard/BottomSheetRemoveCard';
import BottomSheetPrintCard from '../../components/BottomSheetPrintCard/BottomSheetPrintCard';
import BottomSheetClearCard from '../../components/BottomSheetClearCard/BottomSheetClearCard';
import styles from './SectionList.style';
import LocationItemCard from '../../components/LocationItemCard/LocationItemCard';
import { strings } from '../../locales';
import { LocationHeader } from '../../components/locationHeader/LocationHeader';
import { LocationType } from '../../models/LocationType';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import {
  clearLocation,
  deleteAisle,
  getSections
} from '../../state/actions/saga';
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
  setIsToolBarNavigation,
  setSections
} from '../../state/actions/Location';
import BottomSheetAddCard from '../../components/BottomSheetAddCard/BottomSheetAddCard';
import { setPrintingLocationLabels } from '../../state/actions/Print';
import { ClearLocationTarget, LocationName } from '../../models/Location';
import { CREATE_FLOW, SectionItem } from '../../models/LocationItems';
import { CustomModalComponent } from '../Modal/Modal';
import Button from '../../components/buttons/Button';
import { SNACKBAR_TIMEOUT } from '../../utils/global';
import ApiConfirmationModal from '../Modal/ApiConfirmationModal';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';

const MANAGER_APPROVAL = 'manager approval';

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
};

export const handleClearModalClose = (
  setDisplayClearConfirmation: React.Dispatch<React.SetStateAction<boolean>>,
  dispatch: Dispatch<any>
): void => {
  setDisplayClearConfirmation(false);
  dispatch({ type: 'API/CLEAR_LOCATION/RESET' });
};

export const getSectionsApiEffect = (
  getAllSections: AsyncState,
  apiStart: number,
  trackEventCall: (name: string, params: any) => void
): void => {
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
};

export const clearAisleApiEffect = (
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  clearSectionApi: AsyncState,
  setDisplayClearConfirmation: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  if (navigation.isFocused() && !clearSectionApi.isWaiting) {
    if (clearSectionApi.result) {
      // Success
      handleClearModalClose(setDisplayClearConfirmation, dispatch);
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: strings('LOCATION.CLEAR_AISLE_ITEMS_SUCCEED'),
        visibilityTime: SNACKBAR_TIMEOUT
      });
    }

    if (clearSectionApi.error) {
      // Failure
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: strings('LOCATION.CLEAR_AISLE_ITEMS_FAIL'),
        visibilityTime: SNACKBAR_TIMEOUT
      });
    }
  }
};

export const deleteAisleApiEffect = (
  navigation: NavigationProp<any>,
  deleteAisleApi: AsyncState,
  deleteAisleApiStart: number,
  setDeleteAisleApiStart: React.Dispatch<React.SetStateAction<number>>,
  setDisplayConfirmation: React.Dispatch<React.SetStateAction<boolean>>,
  dispatch: Dispatch<any>,
  trackEventCall: (name: string, params: any) => void
): void => {
  if (navigation.isFocused() && !deleteAisleApi.isWaiting) {
    if (deleteAisleApi.result) {
      // Success
      trackEventCall('delete_aisle_success', {
        duration: moment().valueOf() - deleteAisleApiStart
      });
      handleModalClose(setDisplayConfirmation, setDeleteAisleApiStart, dispatch);
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: strings('LOCATION.AISLE_REMOVED'),
        visibilityTime: SNACKBAR_TIMEOUT
      });
      navigation.goBack();
    }
    if (deleteAisleApi.error) {
      // Failure
      trackEventCall('delete_aisle_fail', {
        duration: moment().valueOf() - deleteAisleApiStart,
        reason: deleteAisleApi.error.message || deleteAisleApi.error.toString()
      });
      handleModalClose(setDisplayConfirmation, setDeleteAisleApiStart, dispatch);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: strings('LOCATION.REMOVE_AISLE_FAIL'),
        visibilityTime: SNACKBAR_TIMEOUT
      });
    }
  }
};

const activityModalEffect = (
  navigation: NavigationProp<any>,
  activityModal: boolean,
  deleteAisleApi: AsyncState,
  clearAisleApi: AsyncState,
  dispatch: Dispatch<any>
) => {
  if (navigation.isFocused()) {
    if (!activityModal) {
      if (deleteAisleApi.isWaiting || clearAisleApi.isWaiting) {
        dispatch(showActivityModal());
      }
    } else if (!deleteAisleApi.isWaiting && !clearAisleApi.isWaiting) {
      dispatch(hideActivityModal());
    }
  }
};

interface ClearItemsModalProps {
  displayConfirmation: boolean,
  isClearAisle: boolean,
  clearAisleApi: AsyncState,
  setDisplayConfirmation: React.Dispatch<React.SetStateAction<boolean>>,
  clearLocationTarget: ClearLocationTarget,
  setClearLocationTarget: React.Dispatch<React.SetStateAction<ClearLocationTarget>>,
  handleClearItems: () => void
}

export const ClearItemsModal = (props: ClearItemsModalProps): JSX.Element => {
  const {
    displayConfirmation,
    isClearAisle,
    clearAisleApi,
    setDisplayConfirmation,
    clearLocationTarget,
    setClearLocationTarget,
    handleClearItems
  } = props;
  return (
    <CustomModalComponent
      isVisible={displayConfirmation && isClearAisle}
      onClose={() => setDisplayConfirmation(false)}
      modalType="Error"
    >
      {!clearAisleApi.error ? (
        <View style={styles.confirmationTextView}>
          <Text style={styles.confirmation}>
            {strings('LOCATION.CLEAR_AISLE_ITEMS_CONFIRMATION')}
          </Text>
          <Text style={styles.confirmationExtraText}>
            {strings('LOCATION.CLEAR_AISLE_ITEMS_CHOOSE_SF_OR_RESERVE')}
          </Text>
        </View>
      ) : (
        <View style={styles.confirmationTextView}>
          <MaterialCommunityIcon name="alert" size={30} color={COLOR.RED_500} style={styles.iconPosition} />
          <Text style={styles.confirmation}>
            {strings('LOCATION.CLEAR_AISLE_ITEMS_FAIL')}
          </Text>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Button
          style={styles.delButton}
          title={strings('ITEM.FLOOR')}
          backgroundColor={clearLocationTarget === ClearLocationTarget.FLOOR
            ? COLOR.MAIN_THEME_COLOR
            : COLOR.TRACKER_GREY}
          onPress={() => setClearLocationTarget(ClearLocationTarget.FLOOR)}
        />
        <Button
          style={styles.delButton}
          title={strings('ITEM.RESERVE')}
          backgroundColor={clearLocationTarget === ClearLocationTarget.RESERVE
            ? COLOR.MAIN_THEME_COLOR
            : COLOR.TRACKER_GREY}
          onPress={() => setClearLocationTarget(ClearLocationTarget.RESERVE)}
        />
        <Button
          style={styles.delButton}
          title={strings('GENERICS.ALL')}
          backgroundColor={clearLocationTarget === ClearLocationTarget.FLOORANDRESERVE
            ? COLOR.MAIN_THEME_COLOR
            : COLOR.TRACKER_GREY}
          onPress={() => setClearLocationTarget(ClearLocationTarget.FLOORANDRESERVE)}
        />
      </View>
      <View style={styles.confirmationTextView}>
        <Text style={styles.confirmationExtraText}>
          {strings('LOCATION.CLEAR_AISLE_ITEMS_WONT_DELETE')}
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
          onPress={handleClearItems}
        />
      </View>
    </CustomModalComponent>
  );
};

interface SectionProps {
  aisleId: number;
  aisleName: string;
  zoneName: string;
  getAllSections: AsyncState;
  isManualScanEnabled: boolean;
  dispatch: Dispatch<any>;
  apiStart: number;
  setApiStart: React.Dispatch<React.SetStateAction<number>>;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  trackEventCall: (eventName: string, params?: any) => void;
  locationPopupVisible: boolean;
  displayConfirmation: boolean;
  setDisplayConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  deleteAisleApi: AsyncState;
  deleteAisleApiStart: number;
  setDeleteAisleApiStart: React.Dispatch<React.SetStateAction<number>>;
  isClearAisle: boolean;
  clearAisleApi: AsyncState;
  clearLocationTarget: ClearLocationTarget;
  setClearLocationTarget: React.Dispatch<React.SetStateAction<ClearLocationTarget>>;
  activityModal: boolean;
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
    clearAisleApi,
    clearLocationTarget,
    setClearLocationTarget,
    activityModal
  } = props;

  useEffectHook(() => activityModalEffect(
    navigation, activityModal, deleteAisleApi, clearAisleApi, dispatch
  ), [activityModal, deleteAisleApi, clearAisleApi]);

  useEffectHook(() => deleteAisleApiEffect(
    navigation,
    deleteAisleApi,
    deleteAisleApiStart,
    setDeleteAisleApiStart,
    setDisplayConfirmation,
    dispatch,
    trackEventCall
  ), [deleteAisleApi]);

  useEffectHook(() => clearAisleApiEffect(
    dispatch,
    navigation,
    clearAisleApi,
    setDisplayConfirmation
  ), [clearAisleApi]);

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

  useEffectHook(() => getSectionsApiEffect(
    getAllSections,
    apiStart,
    trackEventCall
  ), [getAllSections]);

  const sectionList: SectionItem[] = getAllSections.result?.data || [];

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
    setDisplayConfirmation(false);
    dispatch(
      deleteAisle({
        aisleId
      })
    );
  };

  const handleClearItems = () => {
    setDisplayConfirmation(false);
    dispatch(clearLocation({ locationId: aisleId, target: clearLocationTarget }));
  };

  const sortSectionName = (sectionNameList: SectionItem[]) => [...sectionNameList].sort((a, b) => (
    parseInt(a.sectionName, 10) - parseInt(b.sectionName, 10)
  ));

  return (
    <View>
      <ApiConfirmationModal
        api={deleteAisleApi}
        handleConfirm={handleDeleteAisle}
        isVisible={displayConfirmation && !isClearAisle}
        mainText={strings('LOCATION.REMOVE_AISLE_CONFIRMATION')}
        subtext1={strings('LOCATION.REMOVE_AISLE_WILL_REMOVE_SECTIONS')}
        onClose={() => setDisplayConfirmation(false)}
      />
      <ClearItemsModal
        clearAisleApi={clearAisleApi}
        handleClearItems={handleClearItems}
        isClearAisle={isClearAisle}
        clearLocationTarget={clearLocationTarget}
        setClearLocationTarget={setClearLocationTarget}
        displayConfirmation={displayConfirmation}
        setDisplayConfirmation={setDisplayConfirmation}
      />
      {isManualScanEnabled && <LocationManualScan keyboardType="default" />}
      <LocationHeader
        location={`${strings('LOCATION.AISLE')} ${zoneName}${aisleName}`}
        details={`${getAllSections.result?.data.length || 0} ${strings('LOCATION.SECTIONS')}`}
      />
      <FlatList
        data={sortSectionName(sectionList)}
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
  const navigation: NavigationProp<any> = useNavigation();
  const getAllSections = useTypedSelector(state => state.async.getSections);
  const { id: aisleId, name: aisleName } = useTypedSelector(state => state.Location.selectedAisle);
  const { name: zoneName } = useTypedSelector(state => state.Location.selectedZone);
  const location = useTypedSelector(state => state.Location);
  const { isManualScanEnabled } = useTypedSelector(state => state.Global);
  const user = useTypedSelector(state => state.User);
  const activityModal = useTypedSelector(state => state.modal.showActivity);
  const [apiStart, setApiStart] = useState(0);
  const dispatch = useDispatch();
  const route = useRoute();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const managerSnapPoints = useMemo(() => ['65%'], []);
  const associateSnapPoints = useMemo(() => ['45%'], []);
  const deleteAisleApi = useTypedSelector(state => state.async.deleteAisle);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [isClearAisle, setIsClearAisle] = useState(false);
  const [deleteAisleApiStart, setDeleteAisleApiStart] = useState(0);
  const clearAisleApi = useTypedSelector(state => state.async.clearLocation);
  const [clearLocationTarget, setClearLocationTarget] = useState<ClearLocationTarget>(ClearLocationTarget.FLOOR);

  useEffect(() => {
    if (navigation.isFocused() && bottomSheetModalRef.current) {
      if (location.locationPopupVisible) {
        bottomSheetModalRef.current.present();
      } else {
        bottomSheetModalRef.current.dismiss();
      }
    }
  }, [location]);

  const locationManagementEdit = () => user.features.includes('location management edit')
    || user.configs.locationManagementEdit;

  const handleAddSections = () => {
    dispatch(setSections(getAllSections.result?.data || []));
    dispatch(setCreateFlow(CREATE_FLOW.CREATE_SECTION));
    dispatch(setAislesToCreateToExistingAisle({ id: aisleId, name: aisleName }));
    if (bottomSheetModalRef.current) {
      bottomSheetModalRef.current.dismiss();
    }
    navigation.navigate('AddSection');
  };

  return (
    <BottomSheetModalProvider>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => dispatch(hideLocationPopup())}
        disabled={!location.locationPopupVisible}
        style={location.locationPopupVisible ? styles.disabledContainer : styles.safeAreaView}
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
          clearAisleApi={clearAisleApi}
          clearLocationTarget={clearLocationTarget}
          setClearLocationTarget={setClearLocationTarget}
          activityModal={activityModal}
        />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={user.features.includes(MANAGER_APPROVAL) ? managerSnapPoints : associateSnapPoints}
          index={0}
          onDismiss={() => dispatch(hideLocationPopup())}
          style={styles.bottomSheetModal}
          backdropComponent={BottomSheetBackdrop}
        >
          <BottomSheetPrintCard
            isVisible={locationManagementEdit()}
            text={strings('LOCATION.PRINT_SECTION')}
            onPress={() => {
              dispatch(hideLocationPopup());
              if (bottomSheetModalRef.current) {
                bottomSheetModalRef.current.dismiss();
              }
              dispatch(setPrintingLocationLabels(LocationName.AISLE));
              navigation.navigate('PrintPriceSign');
              dispatch(setIsToolBarNavigation(false));
            }}
          />
          <BottomSheetAddCard
            isVisible={true}
            text={strings('LOCATION.ADD_SECTIONS')}
            onPress={handleAddSections}
          />
          <BottomSheetClearCard
            isVisible={user.features.includes(MANAGER_APPROVAL)}
            text={strings('LOCATION.CLEAR_AISLE')}
            onPress={() => {
              dispatch(hideLocationPopup());
              setDisplayConfirmation(true);
              setIsClearAisle(true);
            }}
          />
          <BottomSheetSectionRemoveCard
            isVisible={user.features.includes(MANAGER_APPROVAL)}
            text={strings('LOCATION.REMOVE_AISLE')}
            onPress={() => {
              dispatch(hideLocationPopup());
              setDisplayConfirmation(true);
              setIsClearAisle(false);
            }}
          />
        </BottomSheetModal>
      </TouchableOpacity>
    </BottomSheetModalProvider>
  );
};

export default SectionList;
