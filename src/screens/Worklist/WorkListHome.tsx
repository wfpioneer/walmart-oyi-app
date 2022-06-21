import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Button from '../../components/buttons/Button';
import styles from './WorklistHome.style';
import { strings } from '../../locales';

const WorklistHome = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Button
        title={strings('WORKLIST.ITEM_WORKLIST')}
        onPress={() => navigation.navigate('ItemWorklist')}
        style={styles.button}
      />
      <Button
        title={strings('WORKLIST.PALLET_WORKLIST')}
        onPress={() => {}}
        type={Button.Type.PRIMARY}
        style={styles.button}
      />
    </View>
  );
};

export default WorklistHome;
