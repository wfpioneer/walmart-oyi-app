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
import { getSections } from '../../state/actions/saga';
import { trackEvent } from '../../utils/AppCenterTool';
import { validateSession } from '../../utils/sessionTimeout';
import { AsyncState } from '../../models/AsyncState';
import COLOR from '../../themes/Color';
import { setManualScan, setScannedEvent } from '../../state/actions/Global';
import { barcodeEmitter } from '../../utils/scannerUtils';
import LocationManualScan from '../../components/LocationManualScan/LocationManualScan';
import { hideLocationPopup, setCreateFlow, setSections } from '../../state/actions/Location';
import BottomSheetAddCard from '../../components/BottomSheetAddCard/BottomSheetAddCard';
import { setPrintingLocationLabels } from '../../state/actions/Print';
import { LocationName } from '../../models/Location';
import { CREATE_FLOW } from '../../models/LocationItems';

const NoSectionMessage = () : JSX.Element => (
  <View style={styles.noSections}>
    <Text style={styles.noSectionsText}>{strings('LOCATION.NO_SECTIONS_AVAILABLE')}</Text>
  </View>
);

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
    useEffectHook: (effect: EffectCallback, deps?:ReadonlyArray<any>) => void,
    trackEventCall: (eventName: string, params?: any) => void,
    locationPopupVisible: boolean
}

export const SectionScreen = (props: SectionProps) : JSX.Element => {
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
    locationPopupVisible
  } = props;

  // calls to get all sections
  useEffectHook(() => navigation.addListener('focus', () => {
    validateSession(navigation, route.name).then(() => {
      trackEventCall('get_location_api_call');
      setApiStart(moment().valueOf());
      dispatch(getSections({ aisleId }));
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

  return (
    <View>
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
          onPress={() => {}}
        />
        <BottomSheetSectionRemoveCard
          isVisible={userFeatures.includes('manager approval')}
          text={strings('LOCATION.REMOVE_AISLE')}
          onPress={() => {}}
        />
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default SectionList;
