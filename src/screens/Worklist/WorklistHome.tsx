import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import Button from '../../components/buttons/Button';
import styles from './WorklistHome.style';
import { strings } from '../../locales';
import { clearFilter } from '../../state/actions/Worklist';

const WorklistHome = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Button
        title={strings('WORKLIST.ITEM_WORKLIST')}
        onPress={() => {
          dispatch(clearFilter());
          navigation.navigate('WorklistNavigator', { screen: 'ITEMWORKLIST' });
        }}
        style={styles.button}
        testID="itemWkListBtn"
      />
      <Button
        title={strings('WORKLIST.PALLET_WORKLIST')}
        onPress={() => {}}
        type={Button.Type.PRIMARY}
        style={styles.button}
        testID="palletWkListBtn"
      />
    </View>
  );
};

export default WorklistHome;
