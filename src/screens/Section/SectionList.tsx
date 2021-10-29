import React, { EffectCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { hideLocationPopup } from '../../state/actions/Location';
import BottomSheetAddCard from '../../components/BottomSheetAddCard/BottomSheetAddCard';

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
            destinationScreen={LocationType.LOCATION_DETAILS}
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
  const aisleId = useTypedSelector(state => state.Location.selectedAisle.id);
  const aisleName = useTypedSelector(state => state.Location.selectedAisle.name);
  const zoneName = useTypedSelector(state => state.Location.selectedZone.name);
  const [apiStart, setApiStart] = useState(0);
  const dispatch = useDispatch();
  const route = useRoute();
  const location = useTypedSelector(state => state.Location);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['22%', '50%'], []);
  const userFeatures = useTypedSelector(state => state.User.features);
  useEffect(() => {
    if (navigation.isFocused()) {
      if (location.locationPopupVisible) {
        bottomSheetModalRef.current?.present();
      } else {
        bottomSheetModalRef.current?.dismiss();
      }
    }
  }, [location]);
  return (
    <BottomSheetModalProvider>
      <TouchableOpacity
        onPress={() => dispatch(hideLocationPopup())}
        activeOpacity={1}
        disabled={!location.locationPopupVisible}
        style={styles.container}
      >
        <SectionScreen
          aisleId={aisleId}
          aisleName={aisleName}
          zoneName={zoneName}
          navigation={navigation}
          dispatch={dispatch}
          getAllSections={getAllSections}
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
        snapPoints={snapPoints}
        index={0}
        onDismiss={() => dispatch(hideLocationPopup())}
        style={styles.bottomSheetModal}
      >
        <BottomSheetPrintCard
          isVisible={true}
          text={strings('LOCATION.PRINT_SECTION')}
          onPress={() => {}}
        />
        <BottomSheetAddCard
          isVisible={true}
          text={strings('LOCATION.ADD_SECTIONS')}
          onPress={() => {}}
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
