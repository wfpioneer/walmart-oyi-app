import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/buttons/Button';
import { PickingState } from '../../state/reducers/Picking';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { strings } from '../../locales';

interface SFWorklfowProps {
  pickingState: PickingState;
}

export const SalesFloorWorkflowScreen = (props: SFWorklfowProps) => {
  const { pickingState } = props;

  const selectedPicks = pickingState.pickList.filter(pick => pickingState.selectedPicks.includes(pick.id));

  const handleComplete = () => {};

  const handleBin = () => {};

  return (
    <SafeAreaView>
      <View>
        <Button title={strings('PICKING.COMPLETE')} onPress={handleComplete} />
        <Button title={strings('PICKING.READY_TO_BIN')} onPress={handleBin} />
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
