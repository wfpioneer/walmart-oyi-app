import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { WorklistItemI } from '../../models/WorklistItem';
import { Worklist } from './Worklist';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { getWorklist } from '../../state/actions/saga';
import { trackEvent } from '../../utils/AppCenterTool';

export const TodoWorklist = () => {
  const { isWaiting, result, error } = useTypedSelector(state => state.async.getWorklist);
  const dispatch = useDispatch();

  useEffect(() => {
    trackEvent('worklist_items_api_call');
    dispatch(getWorklist());
  }, []);

  useEffect(() => {
    if (result) {
      trackEvent('worklist_items_api_success');
    }

    if (error) {
      trackEvent('worklist_items_api_error');
    }
  }, [result, error]);

  let todoData: WorklistItemI[] | undefined;

  if (result && result.data) {
    todoData = result.data.filter((item: WorklistItemI) => item.completed === false);
  }

  return (
    <Worklist
      data={todoData}
      refreshing={isWaiting}
      onRefresh={() => dispatch(getWorklist())}
      error={error}
    />
  );
};
