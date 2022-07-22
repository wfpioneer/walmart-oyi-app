import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderBackButton } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLOR from '../themes/Color';
import ItemHistory from '../screens/ItemHistory/ItemHistory';
import { strings } from '../locales';
import { useTypedSelector } from '../state/reducers/RootReducer';
import styles from './ItemHistoryNavigator.style';

const Stack = createStackNavigator();

const HistoryNavigator = () => {
  const { title } = useTypedSelector(state => state.ItemHistory);
  const navigation = useNavigation();

  const navigateBack = () => {
    navigation.goBack();
  };

  const renderCloseButton = () => (
    <TouchableOpacity onPress={navigateBack}>
      <View style={styles.closeButton}>
        <MaterialCommunityIcon name="close" size={24} color={COLOR.WHITE} />
      </View>
    </TouchableOpacity>
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerMode: 'float',
        headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        headerTintColor: COLOR.WHITE
      }}
    >
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
              {renderCloseButton()}
            </View>
          )
        }}
      />
    </Stack.Navigator>
  );
};

export default HistoryNavigator;
