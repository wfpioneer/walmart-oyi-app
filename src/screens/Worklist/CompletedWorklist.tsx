import React from 'react';
import { useDispatch } from 'react-redux';
import { WorklistItemI } from '../../models/WorklistItem';
import { Worklist } from './Worklist';
import { getWorklist } from '../../state/actions/saga';
import { useTypedSelector } from '../../state/reducers/RootReducer';

export const CompletedWorklist = () => {
  const { isWaiting, result, error } = useTypedSelector(state => state.async.getWorklist);
  const dispatch = useDispatch();

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
    />
  );
};
