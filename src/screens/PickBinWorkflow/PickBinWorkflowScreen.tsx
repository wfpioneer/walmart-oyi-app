import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/buttons/Button';
import PickPalletInfoCard from '../../components/PickPalletInfoCard/PickPalletInfoCard';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { PickListItem, PickStatus } from '../../models/Picking.d';
import { strings } from '../../locales';
import styles from './PickBinWorkflow.style';

interface PBWorkflowProps {
  userFeatures: string[];
  userId: string;
  selectedPicks: PickListItem[];
}

const PickBinWorkflowScreen = (props: PBWorkflowProps) => {
  const { userFeatures, userId, selectedPicks } = props;

  const handleAccept = () => {};

  const handleRelease = () => {};

  const handleContinue = () => {};

  const handleBin = () => {};

  const actionButtonsView = () => {
    const { status } = selectedPicks[0];
    const isMine = selectedPicks[0].assignedAssociate === userId;

    const amManager = userFeatures.includes('manager approval');
    const releaseButton = ((
      (status === PickStatus.ACCEPTED_BIN || status === PickStatus.ACCEPTED_PICK) && isMine)
      || amManager) ? (
        <Button title={strings('PICKING.RELEASE')} onPress={handleRelease} />
      ) : null;

    const isReady = status === PickStatus.READY_TO_BIN || status === PickStatus.READY_TO_PICK;
    const acceptButton = isReady ? (
      <Button title={strings('PICKING.ACCEPT')} onPress={handleAccept} />
    ) : null;

    const continueButton = isMine && status === PickStatus.ACCEPTED_PICK ? (
      <Button title={strings('GENERICS.CONTINUE')} onPress={handleContinue} />
    ) : null;

    const binButton = isMine && status === PickStatus.ACCEPTED_BIN ? (
      <Button title={strings('PICKING.BIN')} onPress={handleBin} />
    ) : null;

    const buttonList: Array<JSX.Element | null> = [
      releaseButton,
      acceptButton,
      continueButton,
      binButton
    ];
    return buttonList;
  };

  return (
    <SafeAreaView style={styles.container}>
      <PickPalletInfoCard
        onPress={() => {}}
        palletId={selectedPicks[0].palletId}
        palletLocation={selectedPicks[0].palletLocationName}
        pickListItems={selectedPicks}
        pickStatus={selectedPicks[0].status}
      />
      <View style={styles.actionButtonsView}>
        {actionButtonsView()}
      </View>
    </SafeAreaView>
  );
};

const PickBinWorkflow = () => {
  const userFeatures = useTypedSelector(state => state.User.features);
  const userId = useTypedSelector(state => state.User.userId);
  const picking = useTypedSelector(state => state.Picking);

  const selectedPicks = picking.pickList.filter(pick => picking.selectedPicks.includes(pick.id));

  return (
    <PickBinWorkflowScreen
      userFeatures={userFeatures}
      userId={userId}
      selectedPicks={selectedPicks}
    />
  );
};

export default PickBinWorkflow;
