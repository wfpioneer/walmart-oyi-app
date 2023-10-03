import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { WorkListStatus, WorklistItemI } from '../../models/WorklistItem';
import { Worklist } from './Worklist';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { getWorklist, getWorklistV1 } from '../../state/actions/saga';
import { Configurations, area } from '../../models/User';

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
  userConfigs: Configurations;
  imageToken: string | undefined;
  tokenIsWaiting: boolean;
}

export const TodoWorklistScreen = (props: TodoWorklistProps): JSX.Element => {
  const {
    isWaiting, result, error, dispatch, navigation,
    groupToggle, updateGroupToggle, filterCategories, filterExceptions, areas, enableAreaFilter,
    countryCode, showItemImage, onHandsEnabled, userConfigs, imageToken, tokenIsWaiting
  } = props;

  let todoData: WorklistItemI[] | undefined;

  if (result && result.data) {
    todoData = result.data.filter((item: WorklistItemI) => item.completed === false
    || item.worklistStatus === WorkListStatus.TODO);
  }

  if (todoData && !onHandsEnabled) {
    todoData = todoData.filter(item => item.worklistType !== 'NO');
  }

  return (
    <Worklist
      data={todoData}
      refreshing={isWaiting}
      // TODO We can remove inProgress Flag here once the V1 endpoint is in use in Prod
      onRefresh={() => (userConfigs.inProgress ? dispatch(getWorklistV1()) : dispatch(getWorklist()))}
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
      imageToken={imageToken}
      tokenIsWaiting={tokenIsWaiting}
    />
  );
};

export const TodoWorklist = (): JSX.Element => {
  const { countryCode, features, configs } = useTypedSelector(state => state.User);
  // TODO We can remove inProgress Flag here once the V1 endpoint is in use in Prod
  const { isWaiting, result, error } = configs.inProgress ? useTypedSelector(state => state.async.getWorklistV1)
    : useTypedSelector(state => state.async.getWorklist);
  const imageToken = useTypedSelector(state => state.async.getItemCenterToken);
  const [groupToggle, updateGroupToggle] = useState(false);
  const { filterExceptions, filterCategories } = useTypedSelector(state => state.Worklist);
  const { areas, enableAreaFilter, showItemImage } = useTypedSelector(state => state.User.configs);
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
      userConfigs={configs}
      imageToken={countryCode === 'CN' ? imageToken?.result?.data?.data?.accessToken || undefined : undefined}
      tokenIsWaiting={countryCode === 'CN' ? imageToken.isWaiting : false}
    />
  );
};
