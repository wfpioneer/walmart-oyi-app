import { HeaderBackButton } from '@react-navigation/elements';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { Dispatch } from 'react';
import { TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { strings } from '../locales';
import AuditWorklist from '../screens/Worklist/AuditWorklist/AuditWorklistScreen';
import { setManualScan } from '../state/actions/Global';
import { useTypedSelector } from '../state/reducers/RootReducer';
import COLOR from '../themes/Color';
import styles from './AuditWorklistNavigator.style';
import AuditWorklistTabs from './AuditWorklistTabNavigator/AuditWorklistTabNavigator';

const Stack = createStackNavigator();

export const renderScanButton = (
  dispatch: Dispatch<any>,
  isManualScanEnabled: boolean
): JSX.Element => (
  <TouchableOpacity
    onPress={() => {
      dispatch(setManualScan(!isManualScanEnabled));
    }}
    testID="manual-scan"
  >
    <View style={styles.leftButton}>
      <MaterialCommunityIcons
        name="barcode-scan"
        size={20}
        color={COLOR.WHITE}
      />
    </View>
  </TouchableOpacity>
);

const renderPrintButton = () => (
  <TouchableOpacity onPress={() => {}}>
    <View>
      <MaterialCommunityIcons name="printer" size={20} color={COLOR.WHITE} />
    </View>
  </TouchableOpacity>
);

const renderFilterButton = () => (
  <TouchableOpacity onPress={() => {}}>
    <View style={styles.filterButton}>
      <MaterialCommunityIcons name="filter-variant" size={30} color={COLOR.WHITE} />
    </View>
  </TouchableOpacity>
);

interface AuditWorklistNavProps {
  auditWorklists: boolean;
  dispatch: Dispatch<any>;
  isManualScanEnabled: boolean;
  navigation: NavigationProp<any>;
}

export const AuditWorklistNavigatorStack = (
  props: AuditWorklistNavProps
): JSX.Element => {
  const {
    auditWorklists, dispatch, isManualScanEnabled, navigation
  } = props;

  const navigateBack = () => {
    if (auditWorklists) {
      navigation.navigate(strings('WORKLIST.WORKLIST'));
    } else {
      navigation.goBack();
    }
  };
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerMode: 'float',
        headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        headerTintColor: COLOR.WHITE
      })}
    >
      <Stack.Screen
        name="AuditWorklistTabs"
        component={AuditWorklistTabs}
        options={{
          headerTitle: strings('WORKLIST.AUDIT_WORKLIST'),
          headerLeft: hlProps => hlProps.canGoBack && (
          <HeaderBackButton
                // eslint-disable-next-line react/jsx-props-no-spreading
            {...hlProps}
            onPress={navigateBack}
          />
          ),
          headerRight: () => (
            <View style={styles.headerContainer}>
              {renderFilterButton()}
            </View>
          )
        }}
      />
      <Stack.Screen
        name="AuditWorklist"
        component={AuditWorklist}
        options={{
          headerTitle: strings('AUDITS.AUDIT_ITEM'),
          headerRight: () => (
            <View style={styles.headerContainer}>
              {renderPrintButton()}
              {renderScanButton(dispatch, isManualScanEnabled)}
            </View>
          )
        }}
      />
    </Stack.Navigator>
  );
};

const AuditWorklistNavigator = (): JSX.Element => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isManualScanEnabled } = useTypedSelector(state => state.Global);
  const { auditWorklists } = useTypedSelector(state => state.User.configs);
  return (
    <AuditWorklistNavigatorStack
      auditWorklists={auditWorklists}
      dispatch={dispatch}
      navigation={navigation}
      isManualScanEnabled={isManualScanEnabled}
    />
  );
};

export default AuditWorklistNavigator;
