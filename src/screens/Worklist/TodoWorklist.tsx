import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { WorklistItemI } from '../../models/WorklistItem';
import { Worklist } from './Worklist';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { getWorklist } from '../../state/actions/saga';
import { area } from '../../models/User';

interface TodoWorklistProps {
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
  enableAreaFilter: boolean;
  countryCode: string;
  showItemImage: boolean;
  onHandsEnabled: boolean;
}

export const TodoWorklistScreen = (props: TodoWorklistProps): JSX.Element => {
  const {
    isWaiting, result, error, dispatch, navigation,
    groupToggle, updateGroupToggle, filterCategories, filterExceptions, areas, enableAreaFilter,
    countryCode, showItemImage, onHandsEnabled
  } = props;

  let todoData: WorklistItemI[] | undefined;

  if (result && result.data) {
    todoData = result.data.filter((item: WorklistItemI) => item.completed === false);
  }

  if (todoData && !onHandsEnabled) {
    todoData = todoData.filter(item => item.worklistType !== 'NO');
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
      areas={areas}
      enableAreaFilter={enableAreaFilter}
      countryCode={countryCode}
      showItemImage={showItemImage}
    />
  );
};

export const TodoWorklist = (): JSX.Element => {
  const { isWaiting, result, error } = useTypedSelector(state => state.async.getWorklist);
  const [groupToggle, updateGroupToggle] = useState(false);
  const { filterExceptions, filterCategories } = useTypedSelector(state => state.Worklist);
  const { areas, enableAreaFilter, showItemImage } = useTypedSelector(state => state.User.configs);
  const { countryCode, features } = useTypedSelector(state => state.User);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const onHandsEnabled = features.includes('on hands change');
  return (
    <TodoWorklistScreen
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
      enableAreaFilter={enableAreaFilter}
      countryCode={countryCode}
      showItemImage={showItemImage}
      onHandsEnabled={onHandsEnabled}
    />
  );
};
