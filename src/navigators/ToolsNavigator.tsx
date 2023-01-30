import React, { Dispatch } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { strings } from '../locales';
import Tools from '../screens/Tools/Tools';
import COLOR from '../themes/Color';
import LocationManagementNavigator from './LocationManagementNavigator';
import { resetLocationAll } from '../state/actions/Location';
import { useTypedSelector } from '../state/reducers/RootReducer';

const Stack = createStackNavigator();
interface ToolNavigatorProps {
  navigation: NavigationProp<any>;
  dispatch: Dispatch<any>;
  isToolBarNavigation: boolean;
}
export const ToolsNavigatorStack = (props: ToolNavigatorProps): JSX.Element => {
  const { navigation, dispatch, isToolBarNavigation } = props;
  const ToolScreenReset = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'ToolsHomeScreen'
        }
      ]
    });
  };
  return (
    <Stack.Navigator
      screenOptions={{
        headerMode: 'float',
        headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        headerTintColor: COLOR.WHITE
      }}
    >
      <Stack.Screen
        name="ToolsHomeScreen"
        component={Tools}
        options={{
          headerTitle: strings('GENERICS.TOOLS')
        }}
      />
      <Stack.Screen
        name="LocationManagement"
        component={LocationManagementNavigator}
        options={{
          headerShown: false
        }}
        listeners={{
          blur: () => {
            // resets the location screen if user navigates away using the bottom tab navigator
            if (isToolBarNavigation) {
              ToolScreenReset();
            }
          },
          beforeRemove: () => {
            // resets location redux
            dispatch(resetLocationAll());
          }
        }}
      />
    </Stack.Navigator>
  );
};
export const ToolsNavigator = (): JSX.Element => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isToolBarNavigation } = useTypedSelector(state => state.Location);
  return <ToolsNavigatorStack navigation={navigation} dispatch={dispatch} isToolBarNavigation={isToolBarNavigation} />;
};
