import React from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { WorklistItemI } from '../../models/WorklistItem';
import { Worklist } from './Worklist';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { getWorklist } from '../../state/actions/saga';

export const TodoWorklist = () => {
  const { isWaiting, result, error } = useTypedSelector(state => state.async.getWorklist);
  const dispatch = useDispatch();
  return (
    <TodoWorklistScreen
      isWaiting={isWaiting}
      result={result}
      error={error}
      dispatch={dispatch}
    />
  );
};

interface TodoWorklistProps {
  isWaiting: boolean;
  result: any;
  error: any;
  dispatch: Dispatch<any>;
}

export const TodoWorklistScreen = (props: TodoWorklistProps) => {
  const {
    isWaiting, result, error, dispatch
  } = props;

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
