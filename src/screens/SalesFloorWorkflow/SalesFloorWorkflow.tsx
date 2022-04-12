import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/buttons/Button';
import { PickingState } from '../../state/reducers/Picking';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { strings } from '../../locales';
import styles from './SalesFloorWorkflow.style';

interface SFWorklfowProps {
  pickingState: PickingState;
}

export const SalesFloorWorkflowScreen = (props: SFWorklfowProps) => {
  const { pickingState } = props;

  const selectedPicks = pickingState.pickList.filter(pick => pickingState.selectedPicks.includes(pick.id));

  const handleComplete = () => {};

  const handleBin = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.actionButtonsView}>
        <Button title={strings('PICKING.COMPLETE')} onPress={handleComplete} style={styles.actionButton} />
        <Button title={strings('PICKING.READY_TO_BIN')} onPress={handleBin} style={styles.actionButton} />
      </View>
    </SafeAreaView>
  );
};

const SalesFloorWorkflow = () => {
  const pickingState = useTypedSelector(state => state.Picking);

  return (
    <SalesFloorWorkflowScreen
      pickingState={pickingState}
    />
  );
};

export default SalesFloorWorkflow;
