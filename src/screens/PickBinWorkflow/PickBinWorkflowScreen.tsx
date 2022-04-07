import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTypedSelector } from '../../state/reducers/RootReducer';

interface PBWorkflowProps {
  userFeatures: string[];
}

const PickBinWorkflowScreen = (props: PBWorkflowProps) => {
  const { userFeatures } = props;

  const actionButtonsView = () => {
    const buttonList: JSX.Element[] = [];
    return buttonList;
  };

  return (
    <SafeAreaView>
      <Text>PickBinWorkflow</Text>
      <View>
        {actionButtonsView()}
      </View>
    </SafeAreaView>
  );
};
const PickBinWorkflow = () => {
  const userFeatures = useTypedSelector(state => state.User.features);
  return (
    <PickBinWorkflowScreen
      userFeatures={userFeatures}
    />
  );
};

export default PickBinWorkflow;
