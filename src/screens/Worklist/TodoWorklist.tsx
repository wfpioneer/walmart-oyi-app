import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { WorklistItemI } from '../../models/WorklistItem';
import { Worklist } from './Worklist';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { getWorklist } from '../../state/actions/saga';
import { trackEvent } from '../../utils/AppCenterTool';

export const TodoWorklist = () => {
  const { isWaiting, result, error } = useTypedSelector(state => state.async.getWorklist);
  const [groupToggle, updateGroupToggle] = useState(false);
  const { filterExceptions, filterCategories } = useTypedSelector(state => state.Worklist);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  return (
    <TodoWorklistScreen
      isWaiting={isWaiting}
      result={result}
      error={error}
      dispatch={dispatch}
      useEffectHook={useEffect}
      filterCategories={filterCategories}
      filterExceptions={filterExceptions}
      groupToggle={groupToggle}
      updateGroupToggle={updateGroupToggle}
      navigation={navigation}
    />
  );
};

interface TodoWorklistProps {
  isWaiting: boolean;
  result: any;
  error: any;
  dispatch: Dispatch<any>;
  useEffectHook: Function;
  groupToggle: boolean;
  updateGroupToggle: Function;
  filterExceptions: any;
  filterCategories: any;
  navigation: NavigationProp<any>;
}

export const TodoWorklistScreen = (props: TodoWorklistProps) => {
  const {
    isWaiting, result, error, dispatch, useEffectHook, navigation,
    groupToggle, updateGroupToggle, filterCategories, filterExceptions
  } = props;
  useEffectHook(() => {
    if (result) {
      trackEvent('worklist_items_api_success');
    }

    if (error) {
      trackEvent('worklist_items_api_failure', { errorDetails: error.message || JSON.stringify(error) });
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
      dispatch={dispatch}
      filterCategories={filterCategories}
      filterExceptions={filterExceptions}
      groupToggle={groupToggle}
      updateGroupToggle={updateGroupToggle}
      navigation={navigation}
    />
  );
};
