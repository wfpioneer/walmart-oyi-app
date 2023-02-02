import React, { Dispatch } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderBackButton } from '@react-navigation/elements';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Config from 'react-native-config';
import COLOR from '../themes/Color';
import ReviewItemDetails from '../screens/ReviewItemDetails/ReviewItemDetails';
import { strings } from '../locales';
import { setCalcOpen, setManualScan } from '../state/actions/Global';
import { useTypedSelector } from '../state/reducers/RootReducer';
import styles from './ReviewItemDetailsNavigator.style';
import LocationDetails from '../screens/LocationDetails/LocationDetails';
import SelectLocationType from '../screens/SelectLocationType/SelectLocationType';
import { showInfoModal } from '../state/actions/Modal';
import { openCamera } from '../utils/scannerUtils';
import { trackEvent } from '../utils/AppCenterTool';
import { GET_ITEM_DETAILS, GET_ITEM_DETAILS_V3 } from '../state/actions/asyncAPI';
import ItemHistory from '../screens/ItemHistory/ItemHistory';
import { clearItemHistory } from '../state/actions/ItemHistory';
import AuditItem from '../screens/Worklist/AuditItem/AuditItem';
import ReserveAdjustment from '../screens/Worklist/ReserveAdjustment/ReserveAdjustment';

interface ReviewItemDetailsNavigatorProps {
  isManualScanEnabled:boolean;
  calcOpen:boolean;
  exceptionType: string | null | undefined;
  actionCompleted:boolean;
  showCalculator:boolean;
  title:string;
  dispatch:Dispatch<any>;
  navigation:NavigationProp<any>;
}
const Stack = createStackNavigator();

export const renderScanButton = (dispatch: Dispatch<any>,
  isManualScanEnabled: boolean): JSX.Element => (
    <TouchableOpacity testID="barcode-scan" onPress={() => { dispatch(setManualScan(!isManualScanEnabled)); }}>
      <View style={styles.iconBtn}>
        <MaterialCommunityIcon name="barcode-scan" size={20} color={COLOR.WHITE} />
      </View>
    </TouchableOpacity>
);

export const renderCalcButton = (dispatch: Dispatch<any>,
  calcOpen:boolean): JSX.Element => (
    <TouchableOpacity
      onPress={() => {
        dispatch(setCalcOpen(!calcOpen));
      }}
      testID="calc-button"
    >
      <View style={styles.iconBtn}>
        <MaterialCommunityIcon name="calculator" size={20} color={COLOR.WHITE} />
      </View>
    </TouchableOpacity>
);
export const renderCamButton = () => (
  <TouchableOpacity testID="open-camera" onPress={() => { openCamera(); }}>
    <View style={styles.camButton}>
      <MaterialCommunityIcon name="camera" size={20} color={COLOR.WHITE} />
    </View>
  </TouchableOpacity>
);
export const renderPrintQueueButton = (navigation: NavigationProp<any>): JSX.Element => (

  <TouchableOpacity
    testID="print-queue-button"
    onPress={() => {
      trackEvent('print_queue_list_click');
      navigation.navigate('PrintPriceSign', { screen: 'PrintQueue' });
    }}
  >
    <View style={styles.iconBtn}>
      <MaterialCommunityIcon
        name="printer"
        size={20}
        color={COLOR.WHITE}
      />
    </View>
  </TouchableOpacity>
);

export const navigateBack = (dispatch: Dispatch<any>,
  actionCompleted:boolean, exceptionType: string | null | undefined, navigation:NavigationProp<any>) => {
  if (!actionCompleted) {
    if (exceptionType === 'po') {
      return dispatch(showInfoModal(strings('ITEM.NO_SIGN_PRINTED'), strings('ITEM.NO_SIGN_PRINTED_DETAILS')));
    }
    if (exceptionType === 'nsfl') {
      return dispatch(showInfoModal(strings('ITEM.NO_FLOOR_LOCATION'), strings('ITEM.NO_FLOOR_LOCATION_DETAILS')));
    }
  }

  dispatch(setManualScan(false));
  return navigation.goBack();
};
export const navigateHistoryBack = (dispatch: Dispatch<any>, navigation:NavigationProp<any>) => {
  dispatch(clearItemHistory());
  navigation.navigate('ReviewItemDetailsHome');
};
export const renderCloseButton = (dispatch: Dispatch<any>, navigation:NavigationProp<any>):JSX.Element => (
  <TouchableOpacity testID="close-button" onPress={() => navigateHistoryBack(dispatch, navigation)}>
    <View style={styles.closeButton}>
      <MaterialCommunityIcon name="close" size={24} color={COLOR.WHITE} />
    </View>
  </TouchableOpacity>
);

export const ReviewItemDetailsNavigatorStack = (props:ReviewItemDetailsNavigatorProps): JSX.Element => {
  const {
    isManualScanEnabled, calcOpen, exceptionType, actionCompleted, showCalculator, title, dispatch, navigation
  } = props;
  return (
    <Stack.Navigator
      screenOptions={{
        headerMode: 'float',
        headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        headerTintColor: COLOR.WHITE
      }}
    >
      <Stack.Screen
        name="ReviewItemDetailsHome"
        component={ReviewItemDetails}
        options={{
          headerTitle: strings('ITEM.TITLE'),
          headerTitleAlign: 'left',
          headerTitleStyle: { fontSize: 18 },
          headerBackTitleVisible: false,
          headerLeft: prop => (
            // Shouldn't need to do this, but not showing on its own for some reason
            // See https://reactnavigation.org/docs/nesting-navigators/#each-navigator-keeps-its-own-navigation-history
            <HeaderBackButton
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...prop}
              onPress={() => navigateBack(dispatch, actionCompleted, exceptionType, navigation)}
            />
          ),
          headerRight: () => (
            <View style={styles.headerContainer}>
              {Config.ENVIRONMENT === 'dev' || Config.ENVIRONMENT === 'stage' ? renderCamButton() : null}
              {renderScanButton(dispatch, isManualScanEnabled)}
              {renderPrintQueueButton(navigation)}
            </View>
          )
        }}
        listeners={{
          beforeRemove: () => {
            dispatch({ type: GET_ITEM_DETAILS.RESET });
            dispatch({ type: GET_ITEM_DETAILS_V3.RESET });
          }
        }}
      />
      <Stack.Screen
        name="LocationDetails"
        component={LocationDetails}
        options={{
          headerTitle: strings('LOCATION.TITLE'),
          headerTitleAlign: 'left',
          headerTitleStyle: { fontSize: 18 },
          headerBackTitleVisible: false
        }}
      />
      <Stack.Screen
        name="EditLocation"
        component={SelectLocationType}
        options={{
          headerTitle: strings('LOCATION.EDIT_LOCATION'),
          headerTitleAlign: 'left',
          headerTitleStyle: { fontSize: 18 },
          headerBackTitleVisible: false,
          headerRight: () => (
            <View style={styles.headerContainer}>
              {Config.ENVIRONMENT === 'dev' || Config.ENVIRONMENT === 'stage' ? renderCamButton() : null}
            </View>
          )
        }}
      />
      <Stack.Screen
        name="AddLocation"
        component={SelectLocationType}
        options={{
          headerTitle: strings('LOCATION.ADD_NEW_LOCATION'),
          headerTitleAlign: 'left',
          headerTitleStyle: { fontSize: 18 },
          headerBackTitleVisible: false,
          headerRight: () => (
            <View style={styles.headerContainer}>
              {Config.ENVIRONMENT === 'dev' || Config.ENVIRONMENT === 'stage' ? renderCamButton() : null}
            </View>
          )
        }}
      />
      <Stack.Screen
        name="ItemHistory"
        component={ItemHistory}
        options={{
          headerTitle: strings(title),
          headerTitleAlign: 'left',
          headerTitleStyle: { fontSize: 18 },
          headerBackTitleVisible: false,
          headerLeft: () => null,
          headerRight: () => (
            <View>
              {renderCloseButton(dispatch, navigation)}
            </View>
          )
        }}
      />
      <Stack.Screen
        name="AuditItem"
        component={AuditItem}
        options={{
          headerTitle: strings('AUDITS.AUDIT_ITEM'),
          headerRight: () => (
            <View style={styles.headerContainer}>
              {showCalculator && renderCalcButton(dispatch, calcOpen)}
              {renderPrintQueueButton(navigation)}
              {renderScanButton(dispatch, isManualScanEnabled)}
            </View>
          )
        }}
      />
      <Stack.Screen
        name="ReserveAdjustment"
        component={ReserveAdjustment}
        options={{
          headerTitle: strings('ITEM.RESERVE_ADJUSTMENT'),
          headerTitleAlign: 'left',
          headerTitleStyle: { fontSize: 18 },
          headerBackTitleVisible: false,
          headerRight: () => (
            <View style={styles.headerContainer}>
              {showCalculator && renderCalcButton(dispatch, calcOpen)}
              {renderPrintQueueButton(navigation)}
              {renderScanButton(dispatch, isManualScanEnabled)}
            </View>
          )
        }}
      />
    </Stack.Navigator>
  );
};
const ReviewItemDetailsNavigator = ():JSX.Element => {
  const { isManualScanEnabled, calcOpen } = useTypedSelector(state => state.Global);
  const { exceptionType, actionCompleted } = useTypedSelector(state => state.ItemDetailScreen);
  const { showCalculator } = useTypedSelector(state => state.User.configs);
  const { title } = useTypedSelector(state => state.ItemHistory);
  const dispatch = useDispatch();
  const navigation: NavigationProp<any> = useNavigation();
  return (
    <ReviewItemDetailsNavigatorStack
      isManualScanEnabled={isManualScanEnabled}
      calcOpen={calcOpen}
      exceptionType={exceptionType}
      actionCompleted={actionCompleted}
      showCalculator={showCalculator}
      title={title}
      dispatch={dispatch}
      navigation={navigation}

    />
  );
};

export default ReviewItemDetailsNavigator;
