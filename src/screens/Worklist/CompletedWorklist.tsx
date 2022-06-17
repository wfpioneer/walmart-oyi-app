import React, { useState } from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { WorklistItemI } from '../../models/WorklistItem';
import { Worklist } from './ItemWorklist';
import { getWorklist } from '../../state/actions/saga';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { area } from '../../models/User';

interface CompletedWorklistProps {
    isWaiting: boolean;
    result: any;
    error: any;
    dispatch: Dispatch<any>;
    groupToggle: boolean;
    updateGroupToggle: React.Dispatch<React.SetStateAction<boolean>>;
    filterExceptions: string[];
    filterCategories: string[];
    navigation: NavigationProp<any>;
    areas: area[];
}

export const CompletedWorklistScreen = (props: CompletedWorklistProps): JSX.Element => {
  const {
    isWaiting, result, error, dispatch, navigation,
    groupToggle, updateGroupToggle, filterCategories, filterExceptions, areas
  } = props;

  let completedItems: WorklistItemI[] | undefined;

  if (result && result.data) {
    completedItems = result.data.filter((item: WorklistItemI) => item.completed === true);
  }

  return (
    <Worklist
      data={completedItems}
      refreshing={isWaiting}
      onRefresh={() => dispatch(getWorklist())}
      error={error}
      dispatch={dispatch}
      filterCategories={filterCategories}
      filterExceptions={filterExceptions}
      groupToggle={groupToggle}
      updateGroupToggle={updateGroupToggle}
      navigation={navigation}
      areas={areas}
    />
  );
};

export const CompletedWorklist = (): JSX.Element => {
  const { isWaiting, result, error } = useTypedSelector(state => state.async.getWorklist);
  const [groupToggle, updateGroupToggle] = useState(false);
  const { filterExceptions, filterCategories } = useTypedSelector(state => state.Worklist);
  const { areas } = useTypedSelector(state => state.User.configs);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  return (
    <CompletedWorklistScreen
      isWaiting={isWaiting}
      result={result}
      error={error}
      dispatch={dispatch}
      filterCategories={filterCategories}
      filterExceptions={filterExceptions}
      groupToggle={groupToggle}
      updateGroupToggle={updateGroupToggle}
      navigation={navigation}
      areas={areas}
    />
  );
};
