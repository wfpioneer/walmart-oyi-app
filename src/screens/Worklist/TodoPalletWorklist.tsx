import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MissingPalletWorklistItemI } from '../../models/WorklistItem';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { PalletWorklist } from './PalletWorklist';
import { AsyncState } from '../../models/AsyncState';
import { getPalletWorklist } from '../../state/actions/saga';

interface TodoWorklistProps {
  getMPWorklistApi: AsyncState;
  displayConfirmation: boolean;
  setDisplayConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  dispatch: Dispatch<any>;
  clearPalletAPI: AsyncState;
  navigation: NavigationProp<any>;
  groupToggle: boolean;
  updateGroupToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TodoPalletWorklistScreen = (
  props: TodoWorklistProps
): JSX.Element => {
  const {
    clearPalletAPI,
    displayConfirmation,
    dispatch,
    getMPWorklistApi,
    setDisplayConfirmation,
    navigation,
    groupToggle,
    updateGroupToggle
  } = props;

  const { isWaiting, error, result } = getMPWorklistApi;

  let todoPalletData: MissingPalletWorklistItemI[] | undefined;

  if (result && result.data) {
    todoPalletData = result.data.filter(
      (item: MissingPalletWorklistItemI) => item.completed === false
    );
  }
  return (
    <PalletWorklist
      palletWorklist={todoPalletData}
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
    />
  );
};

export const TodoPalletWorklist = (): JSX.Element => {
  const getMPWorklistApi = useTypedSelector(state => state.async.getPalletWorklist);
  const clearPalletAPI = useTypedSelector(state => state.async.clearPallet);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [groupToggle, updateGroupToggle] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  return (
    <TodoPalletWorklistScreen
      dispatch={dispatch}
      clearPalletAPI={clearPalletAPI}
      displayConfirmation={displayConfirmation}
      setDisplayConfirmation={setDisplayConfirmation}
      getMPWorklistApi={getMPWorklistApi}
      navigation={navigation}
      groupToggle={groupToggle}
      updateGroupToggle={updateGroupToggle}
    />
  );
};
