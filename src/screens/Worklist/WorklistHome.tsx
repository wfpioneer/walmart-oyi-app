import React from 'react';
import { View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import Button, { ButtonType } from '../../components/buttons/Button';
import styles from './WorklistHome.style';
import { strings } from '../../locales';
import { clearFilter } from '../../state/actions/Worklist';

export interface WorklistHomeScreenProps {
  navigation: NavigationProp<any>;
  dispatch: Dispatch<any>;
}

export const WorklistHomeScreen = (props: WorklistHomeScreenProps) => {
  const { navigation, dispatch } = props;

  return (
    <View style={styles.container}>
      <Button
        title={strings('WORKLIST.ITEM_WORKLIST')}
        onPress={() => {
          dispatch(clearFilter());
          navigation.navigate('WorklistNavigator', { screen: 'ITEMWORKLIST' });
        }}
        style={styles.button}
        testID="itemWorkListButton"
      />
      <Button
        title={strings('WORKLIST.PALLET_WORKLIST')}
        onPress={() => navigation.navigate('MissingPalletWorklist', { screen: 'MissingPalletWorklistTabs' })}
        type={ButtonType.PRIMARY}
        style={styles.button}
        testID="palletWorkListButton"
      />
    </View>
  );
};

const WorklistHome = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  return (
    <WorklistHomeScreen
      navigation={navigation}
      dispatch={dispatch}
    />
  );
};

export default WorklistHome;
