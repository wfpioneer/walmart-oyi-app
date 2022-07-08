import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MissingPalletWorklistItemI } from '../../models/WorklistItem';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { PalletWorklist } from './PalletWorklist';
import { AsyncState } from '../../models/AsyncState';
import { getPalletWorklist } from '../../state/actions/saga';

interface CompletedWorklistProps {
  getMPWorklistApi: AsyncState;
  displayConfirmation: boolean;
  setDisplayConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  dispatch: Dispatch<any>;
  clearPalletAPI: AsyncState;
  navigation: NavigationProp<any>;
}

export const CompletedPalletWorklistScreen = (
  props: CompletedWorklistProps
): JSX.Element => {
  const {
    clearPalletAPI,
    displayConfirmation,
    dispatch,
    getMPWorklistApi,
    setDisplayConfirmation,
    navigation
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
    />
  );
};

export const CompletedPalletWorklist = (): JSX.Element => {
  const getMPWorklistApi = useTypedSelector(state => state.async.getWorklist);
  const clearPalletAPI = useTypedSelector(state => state.async.clearPallet);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
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
    />
  );
};
