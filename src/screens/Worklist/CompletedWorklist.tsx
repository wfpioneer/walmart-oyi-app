import React from 'react';
import {WorklistItemI} from "../../models/WorklistItem";
import { Worklist } from './Worklist';
import {getWorklist} from "../../state/actions/saga";
import {useTypedSelector} from "../../state/reducers/RootReducer";
import {useDispatch} from "react-redux";

export const CompletedWorklist = () => {
  const { isWaiting, result, error } = useTypedSelector(state => state.async.getWorklist);
  const dispatch = useDispatch();

  let completedData: WorklistItemI[] | undefined = undefined;

  if (result && result.data) {
    completedData = result.data.filter((item: WorklistItemI) => item.isCompleted === true);
  }

  return (
    <Worklist
      data={completedData}
      refreshing={ isWaiting }
      onRefresh={ () => dispatch(getWorklist()) }
      error={ error }
    />
  )
}
