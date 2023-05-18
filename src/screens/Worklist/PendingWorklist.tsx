import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { WorkListStatus, WorklistItemI } from '../../models/WorklistItem';
import { Worklist } from './Worklist';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { getWorklistV1 } from '../../state/actions/saga';
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

export const PendingWorklistScreen = (props: TodoWorklistProps): JSX.Element => {
  const {
    isWaiting, result, error, dispatch, navigation,
    groupToggle, updateGroupToggle, filterCategories, filterExceptions, areas, enableAreaFilter,
    countryCode, showItemImage, onHandsEnabled
  } = props;

  let pendingData: WorklistItemI[] | undefined;

  if (result && result.data) {
    pendingData = result.data.filter((item: WorklistItemI) => item.worklistStatus === WorkListStatus.INPROGRESS);
  }

  if (pendingData && !onHandsEnabled) {
    pendingData = pendingData.filter(item => item.worklistType !== 'NO');
  }

  return (
    <Worklist
      data={pendingData}
      refreshing={isWaiting}
      onRefresh={() => dispatch(getWorklistV1())}
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

export const PendingWorklist = (): JSX.Element => {
  const { isWaiting, result, error } = useTypedSelector(state => state.async.getWorklist);
  const [groupToggle, updateGroupToggle] = useState(false);
  const { filterExceptions, filterCategories } = useTypedSelector(state => state.Worklist);
  const { areas, enableAreaFilter, showItemImage } = useTypedSelector(state => state.User.configs);
  const { countryCode, features } = useTypedSelector(state => state.User);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const onHandsEnabled = features.includes('on hands change');
  return (
    <PendingWorklistScreen
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
