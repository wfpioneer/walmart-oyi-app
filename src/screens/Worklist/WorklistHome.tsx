import React from 'react';
import { View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import Button, { ButtonType } from '../../components/buttons/Button';
import styles from './WorklistHome.style';
import { strings } from '../../locales';
import { clearFilter, setWorklistType } from '../../state/actions/Worklist';
import { Configurations } from '../../models/User';
import { useTypedSelector } from '../../state/reducers/RootReducer';

export interface WorklistHomeScreenProps {
  navigation: NavigationProp<any>;
  dispatch: Dispatch<any>;
  configs: Configurations;
}

export const WorklistHomeScreen = (props: WorklistHomeScreenProps) => {
  const { navigation, dispatch, configs } = props;

  return (
    <View style={styles.container}>
      <Button
        title={strings('WORKLIST.ITEM_WORKLIST')}
        onPress={() => {
          dispatch(clearFilter());
          dispatch(setWorklistType("ITEM"));
          navigation.navigate('WorklistNavigator', { screen: 'ITEMWORKLIST' });
        }}
        style={styles.button}
        testID="itemWorkListButton"
      />
      {configs.palletWorklists
      && (
        <Button
          title={strings('WORKLIST.PALLET_WORKLIST')}
          onPress={() => navigation.navigate('MissingPalletWorklist', { screen: 'MissingPalletWorklistTabs' })}
          type={ButtonType.PRIMARY}
          style={styles.button}
          testID="palletWorkListButton"
        />
      )}
      { configs.auditWorklists
        && (
        <Button
          title={strings('WORKLIST.AUDIT_WORKLIST')}
          onPress={() => {
            dispatch(clearFilter());
            dispatch(setWorklistType('AUDIT'));
            navigation.navigate('AuditWorklistNavigator', { screen: 'AuditWorklistTabs' });
          }}
          type={ButtonType.PRIMARY}
          style={styles.button}
          testID="auditWorkListButton"
        />
        )}
    </View>
  );
};

const WorklistHome = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const configs = useTypedSelector(state => state.User.configs);
  return (
    <WorklistHomeScreen
      navigation={navigation}
      dispatch={dispatch}
      configs={configs}
    />
  );
};

export default WorklistHome;
