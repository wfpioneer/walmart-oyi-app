import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MissingPalletWorklistItemI } from '../../models/WorklistItem';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { PalletWorklist } from './PalletWorklist';
import { AsyncState } from '../../models/AsyncState';
import { mockMissingPalletWorklistTodo } from '../../mockData/mockWorkList';

interface TodoWorklistProps {
  getMPWorklistApi: AsyncState;
  displayConfirmation: boolean;
  setDisplayConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  dispatch: Dispatch<any>;
  clearPalletAPI: AsyncState;
  navigation: NavigationProp<any>;
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
    navigation
  } = props;

  let todoPalletData: MissingPalletWorklistItemI[] | undefined;
  // TODO remove when implementing getPalletWorklist items api call
  todoPalletData = mockMissingPalletWorklistTodo;

  if (getMPWorklistApi.result && getMPWorklistApi.result.data) {
    todoPalletData = getMPWorklistApi.result.data.filter(
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
    />
  );
};

export const TodoPalletWorklist = (): JSX.Element => {
  const getMPWorklistApi = useTypedSelector(state => state.async.getWorklist);
  const clearPalletAPI = useTypedSelector(state => state.async.clearPallet);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
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
    />
  );
};
