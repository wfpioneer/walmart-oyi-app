import React, { useState } from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { WorkListStatus, WorklistItemI } from '../../models/WorklistItem';
import { Worklist } from './Worklist';
import { getWorklist, getWorklistV1 } from '../../state/actions/saga';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { Configurations, area } from '../../models/User';

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
    enableAreaFilter: boolean;
    countryCode: string;
    showItemImage: boolean;
    onHandsEnabled: boolean;
    userConfigs: Configurations;
}

export const CompletedWorklistScreen = (props: CompletedWorklistProps): JSX.Element => {
  const {
    isWaiting, result, error, dispatch, navigation,
    groupToggle, updateGroupToggle, filterCategories, filterExceptions, areas, enableAreaFilter,
    countryCode, showItemImage, onHandsEnabled, userConfigs
  } = props;

  let completedItems: WorklistItemI[] | undefined;

  if (result && result.data) {
    completedItems = result.data.filter((item: WorklistItemI) => item.completed === true
    || (item.worklistStatus === WorkListStatus.COMPLETED
    || (!userConfigs.inProgress && item.worklistStatus === WorkListStatus.INPROGRESS)));
  }

  if (completedItems && !onHandsEnabled) {
    completedItems = completedItems.filter(item => item.worklistType !== 'NO');
  }

  return (
    <Worklist
      data={completedItems}
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
    />
  );
};

export const CompletedWorklist = (): JSX.Element => {
  const { countryCode, features, configs } = useTypedSelector(state => state.User);
  // TODO We can remove inProgress Flag here once the V1 endpoint is in use in Prod
  const { isWaiting, result, error } = configs.inProgress ? useTypedSelector(state => state.async.getWorklistV1)
    : useTypedSelector(state => state.async.getWorklist);
  const [groupToggle, updateGroupToggle] = useState(false);
  const { filterExceptions, filterCategories } = useTypedSelector(state => state.Worklist);
  const { areas, enableAreaFilter, showItemImage } = useTypedSelector(state => state.User.configs);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const onHandsEnabled = features.includes('on hands change');
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
      enableAreaFilter={enableAreaFilter}
      countryCode={countryCode}
      showItemImage={showItemImage}
      onHandsEnabled={onHandsEnabled}
      userConfigs={configs}
    />
  );
};
