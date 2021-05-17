import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { WorklistItemI } from '../../models/WorklistItem';
import { Worklist } from './Worklist';
import { getWorklist } from '../../state/actions/saga';
import { useTypedSelector } from '../../state/reducers/RootReducer';

export const CompletedWorklist = () => {
  const { isWaiting, result, error } = useTypedSelector(state => state.async.getWorklist);
  const [groupToggle, updateGroupToggle] = useState(false);
  const { filterExceptions, filterCategories } = useTypedSelector(state => state.Worklist);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  let completedData: WorklistItemI[] | undefined;

  if (result && result.data) {
    completedData = result.data.filter((item: WorklistItemI) => item.completed === true);
  }

  return (
    <Worklist
      data={completedData}
      refreshing={isWaiting}
      onRefresh={() => dispatch(getWorklist())}
      error={error}
      dispatch={dispatch}
      filterCategories={filterCategories}
      filterExceptions={filterExceptions}
      groupToggle={groupToggle}
      updateGroupToggle={updateGroupToggle}
      navigation={navigation}
    />
  );
};
