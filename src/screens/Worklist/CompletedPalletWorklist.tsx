import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MissingPalletWorklistItemI, Tabs } from '../../models/PalletWorklist';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { PalletWorklist } from './PalletWorklist';
import { AsyncState } from '../../models/AsyncState';
import { getPalletWorklist } from '../../state/actions/saga';

interface CompletedWorklistScreenProps {
  getMPWorklistApi: AsyncState;
  displayConfirmation: boolean;
  setDisplayConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  dispatch: Dispatch<any>;
  clearPalletAPI: AsyncState;
  navigation: NavigationProp<any>;
  groupToggle: boolean;
  updateGroupToggle: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTab: Tabs;
  setPalletClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

interface CompletedWorklistProps {
  setPalletClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CompletedPalletWorklistScreen = (
  props: CompletedWorklistScreenProps
): JSX.Element => {
  const {
    clearPalletAPI,
    displayConfirmation,
    dispatch,
    getMPWorklistApi,
    setDisplayConfirmation,
    navigation,
    groupToggle,
    updateGroupToggle,
    selectedTab,
    setPalletClicked
  } = props;

  const { isWaiting, error, result } = getMPWorklistApi;

  let completedPalletItems: MissingPalletWorklistItemI[] | undefined;

  if (result && result.data) {
    completedPalletItems = result.data.filter(
      (item: MissingPalletWorklistItemI) => item.completed === true
    );
  }
  return (
    <PalletWorklist
      palletWorklist={completedPalletItems}
      displayConfirmation={displayConfirmation}
      setDisplayConfirmation={setDisplayConfirmation}
      dispatch={dispatch}
      clearPalletAPI={clearPalletAPI}
      navigation={navigation}
      useEffectHook={useEffect}
      onRefresh={() => dispatch(getPalletWorklist({ worklistType: ['MP'] }))}
      refreshing={isWaiting}
      error={error}
      groupToggle={groupToggle}
      updateGroupToggle={updateGroupToggle}
      selectedTab={selectedTab}
      setPalletClicked={setPalletClicked}
    />
  );
};

export const CompletedPalletWorklist = (props: CompletedWorklistProps): JSX.Element => {
  const { setPalletClicked } = props;
  const getMPWorklistApi = useTypedSelector(state => state.async.getPalletWorklist);
  const clearPalletAPI = useTypedSelector(state => state.async.clearPallet);
  const selectedTab = useTypedSelector(state => state.PalletWorklist.selectedTab);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [groupToggle, updateGroupToggle] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  return (
    <CompletedPalletWorklistScreen
      dispatch={dispatch}
      clearPalletAPI={clearPalletAPI}
      displayConfirmation={displayConfirmation}
      setDisplayConfirmation={setDisplayConfirmation}
      getMPWorklistApi={getMPWorklistApi}
      navigation={navigation}
      groupToggle={groupToggle}
      updateGroupToggle={updateGroupToggle}
      selectedTab={selectedTab}
      setPalletClicked={setPalletClicked}
    />
  );
};