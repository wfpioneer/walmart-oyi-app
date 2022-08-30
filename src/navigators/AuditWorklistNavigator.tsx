import { HeaderBackButton } from '@react-navigation/elements';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import { strings } from '../locales';
import COLOR from '../themes/Color';

const Stack = createStackNavigator();
interface AuditWorklistNavProps {
  auditWorklists: boolean;
  navigation: NavigationProp<any>
}
const AuditWorklistNavigatorStack = (props: AuditWorklistNavProps): JSX.Element => {
  const { auditWorklists, navigation } = props;
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
        component={() => <View />}
        options={{
          headerTitle: strings('WORKLIST.PALLET_WORKLIST'),
          headerLeft: hlProps => hlProps.canGoBack && (
          <HeaderBackButton
          // eslint-disable-next-line react/jsx-props-no-spreading
            {...hlProps}
            onPress={navigateBack}
          />
          )
        }}
      />
    </Stack.Navigator>
  );
};
const AuditWorklistNavigator = (): JSX.Element => {
  const navigation = useNavigation();
  return (
    <AuditWorklistNavigatorStack
      auditWorklists={false}
      navigation={navigation}
    />
  );
};

export default AuditWorklistNavigator;
