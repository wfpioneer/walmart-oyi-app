import React, { useEffect, useMemo, useRef } from 'react';
import {
  Text, TouchableOpacity, View
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useDispatch } from 'react-redux';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { Dispatch } from 'redux';
import { strings } from '../../locales';
import { LocationItem, SectionDetailsItem, SectionDetailsPallet } from '../../models/LocationItems';
import { COLOR } from '../../themes/Color';
import styles from './LocationTabNavigator.style';
import LocationHeader from '../../components/locationHeader/LocationHeader';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { validateSession } from '../../utils/sessionTimeout';
import { getSectionDetails } from '../../state/actions/saga';
import SectionDetails from '../../screens/SectionDetails/SectionDetailsScreen';
import { hideLocationPopup } from '../../state/actions/Location';
import BottomSheetClearCard from '../../components/BottomSheetClearCard/BottomSheetClearCard';
import BottomSheetRemoveCard from '../../components/BottomSheetRemoveCard/BottomSheetRemoveCard';
import Button from '../../components/buttons/Button';

const Tab = createMaterialTopTabNavigator();

interface LocationProps {
    floorItems: SectionDetailsItem[];
    reserveItems: SectionDetailsPallet[];
    locationName: string;
    locationPopupVisible: boolean;
    dispatch: Dispatch<any>;
}

interface HeaderProps {
    headerText: string;
}

export const Header = (props: HeaderProps): JSX.Element => {
  const { headerText } = props;
  const navigation = useNavigation();
  const addNewLocation = () => {
    navigation.navigate('AddLocation');
  };
  return (
    <>
      <View style={styles.tabHeader}>
        <Text style={styles.tabHeaderText}>
          {headerText}
        </Text>
        <Button
          type={3}
          title={strings('GENERICS.ADD')}
          titleColor={COLOR.MAIN_THEME_COLOR}
          titleFontSize={12}
          titleFontWeight="bold"
          height={28}
          onPress={() => addNewLocation()}
        />
      </View>
    </>
  );
};

const floorDetailsList = () => (
  <>
    <Header headerText={strings('LOCATION.ITEMS')} />
    <SectionDetails />
  </>
);

const reserveDetailsList = () => (
  <>
    <Header headerText={strings('LOCATION.PALLETS')} />
    <SectionDetails />
  </>
);

export const LocationTabsNavigator = (props: LocationProps): JSX.Element => {
  const {
    dispatch,
    locationName,
    locationPopupVisible,
    floorItems,
    reserveItems
  } = props;
  return (
    <>
      <LocationHeader
        location={`${strings('LOCATION.SECTION')} ${locationName}`}
        details={`${floorItems.length ?? 0} ${strings('LOCATION.ITEMS')},`
        + ` ${reserveItems.length ?? 0} ${strings('LOCATION.PALLETS')}`}
      />
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: COLOR.MAIN_THEME_COLOR,
          inactiveTintColor: COLOR.GREY_700,
          style: { backgroundColor: COLOR.WHITE },
          indicatorStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR }
        }}
      >
        <Tab.Screen
          name="FloorDetails"
          component={floorDetailsList}
          options={{
            title: `${strings('LOCATION.FLOORS')} (${floorItems.length ?? 0})`
          }}
          listeners={{
            tabPress: e => {
              if (locationPopupVisible) {
                e.preventDefault();
                dispatch(hideLocationPopup());
              }
            }
          }}
        />
        <Tab.Screen
          name="ReserveDetails"
          component={reserveDetailsList}
          options={{
            title: `${strings('LOCATION.RESERVES')} (${reserveItems.length ?? 0})`
          }}
          listeners={{
            tabPress: e => {
              if (locationPopupVisible) {
                e.preventDefault();
                dispatch(hideLocationPopup());
              }
            }
          }}
        />
      </Tab.Navigator>
    </>
  );
};

const LocationTabs = () : JSX.Element => {
  const { selectedAisle, selectedZone, selectedSection } = useTypedSelector(state => state.Location);
  const { result } = useTypedSelector(state => state.async.getSectionDetails);
  const userFeatures = useTypedSelector(state => state.User.features);
  const locationPopupVisible = useTypedSelector(state => state.Location.locationPopupVisible);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  const locItem: LocationItem | undefined = (result && result.data);
  const locationName = `${selectedZone.name}${selectedAisle.name}-${selectedSection.name}`;

  const bottomSheetLocationDetailsModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['35%', '50%'], []);

  useEffect(() => {
    if (navigation.isFocused()) {
      if (locationPopupVisible) {
        bottomSheetLocationDetailsModalRef.current?.present();
      } else {
        bottomSheetLocationDetailsModalRef.current?.dismiss();
      }
    }
  }, [locationPopupVisible]);

  // Call Get Section Details
  useEffect(() => {
    validateSession(navigation, route.name).then(() => {
      dispatch(getSectionDetails({ sectionId: locationName }));
    }).catch(() => {});
  }, [navigation]);

  return (
    <BottomSheetModalProvider>
      <TouchableOpacity
        onPress={() => dispatch(hideLocationPopup())}
        activeOpacity={1}
        disabled={!locationPopupVisible}
        style={styles.container}
      >
        <LocationTabsNavigator
          dispatch={dispatch}
          floorItems={locItem?.floor ?? []}
          reserveItems={locItem?.reserve ?? []}
          locationName={locationName}
          locationPopupVisible={locationPopupVisible}
        />
      </TouchableOpacity>
      <BottomSheetModal
        ref={bottomSheetLocationDetailsModalRef}
        snapPoints={snapPoints}
        index={0}
        onDismiss={() => dispatch(hideLocationPopup())}
        style={styles.bottomSheetModal}
      >
        <BottomSheetView>
          <BottomSheetClearCard
            onPress={() => {}}
            text={strings('LOCATION.CLEAR_BAY')}
            isManagerOption={false}
            isVisible={true}
          />
          <BottomSheetRemoveCard
            onPress={() => {}}
            text={strings('LOCATION.REMOVE_BAY')}
            isVisible={userFeatures.includes('manager approval')}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default LocationTabs;
