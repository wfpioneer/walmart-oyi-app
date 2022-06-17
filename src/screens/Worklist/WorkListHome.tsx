import React from 'react';
import { View } from 'react-native';
import Button from '../../components/buttons/Button';
import styles from './WorkListHome.style';
import { strings } from '../../locales';

const WorkLikstHome = () => (
  <View style={styles.container}>
    <Button
      title={strings('WORKLIST.ITEM_WORKLIST')}
      onPress={() => {}}
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

export default WorkLikstHome;
