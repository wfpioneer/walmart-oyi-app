import React, { Dispatch } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import COLOR from '../themes/Color';
import { strings } from '../locales';
import { useTypedSelector } from '../state/reducers/RootReducer';
import { setManualScan } from '../state/actions/Global';
import styles from './AuditItemWorklistNavigator.style';
import { AuditItemWorklistTabs } from '../screens/Worklist/AuditItemWorklistTabs';

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
  <TouchableOpacity onPress={() => { }}>
    <View>
      <MaterialCommunityIcons
        name="printer"
        size={20}
        color={COLOR.WHITE}
      />
    </View>
  </TouchableOpacity>
);

interface AuditItemWorklistNavigatorProps {
  isManualScanEnabled: boolean;
  dispatch: Dispatch<any>;
}

export const AuditItemWorklistNavigatorStack = (
  props: AuditItemWorklistNavigatorProps
): JSX.Element => {
  const {
    dispatch, isManualScanEnabled
  } = props;

  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerMode: 'float',
        headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        headerTintColor: COLOR.WHITE
      })}
    >
      <Stack.Screen
        name="AuditItemWorklistTabs"
        component={AuditItemWorklistTabs}
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

const AuditItemWorklistNavigator = (): JSX.Element => {
  const dispatch = useDispatch();
  const { isManualScanEnabled } = useTypedSelector(state => state.Global);
  return (
    <AuditItemWorklistNavigatorStack
      dispatch={dispatch}
      isManualScanEnabled={isManualScanEnabled}
    />
  );
};

export default AuditItemWorklistNavigator;
