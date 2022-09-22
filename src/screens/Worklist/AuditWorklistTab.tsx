import { NavigationProp, useNavigation } from '@react-navigation/native';
import { groupBy, isEmpty, partition } from 'lodash';
import React, { useState } from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { ActivityIndicator, FlatList } from 'react-native';
import CollapseAllBar from '../../components/CollapseAllBar/CollapseAllBar';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { WorklistItemI } from '../../models/WorklistItem';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import { getWorklist } from '../../state/actions/saga';
import COLOR from '../../themes/Color';
import styles from './AuditWorklistTab.style';

import {
  mockCompletedAuditWorklist, mockToDoAuditWorklist
} from '../../mockData/mockWorkList';

export interface AuditWorklistTabProps {
    toDo: boolean;
}

export interface AuditWorklistTabScreenProps {
    items: WorklistItemI[];
    navigation: NavigationProp<any>;
    dispatch: Dispatch<any>;
    toDo: boolean;
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
    refreshing: boolean;
}

const renderCategoryCard = (category: string, items: WorklistItemI[], collapsed: boolean) => (
  <CategoryCard
    category={category}
    listOfItems={items}
    collapsed={collapsed}
  />
);

export const AuditWorklistTabScreen = (props: AuditWorklistTabScreenProps) => {
  const {
    items, collapsed, setCollapsed, refreshing, dispatch
  } = props;
  const itemsBasedOnCategory = groupBy(items, item => `${item.catgNbr} - ${item.catgName}`);
  const sortedItemKeys = Object.keys(itemsBasedOnCategory).sort((a, b) => (a > b ? 1 : -1));

  if (refreshing) {
    return (
      <ActivityIndicator
        animating={refreshing}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }

  return (
    <>
      <CollapseAllBar collapsed={collapsed} onclick={() => setCollapsed(!collapsed)} />
      <FlatList
        data={sortedItemKeys}
        renderItem={({ item: key }) => renderCategoryCard(key, itemsBasedOnCategory[key], collapsed)}
        keyExtractor={item => `category-${item}`}
        // TODO: worklist types needs to be updated after Filter component gets completed
        onRefresh={() => dispatch(getWorklist({ worklistType: ['AU', 'RA'] }))}
        refreshing={refreshing}
      />
    </>
  );
};

const AuditWorklistTab = (props: AuditWorklistTabProps) => {
  const { toDo } = props;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [collapsed, setCollapsed] = useState(false);
  const auditWorklistItems = useTypedSelector(state => state.AuditWorklist.items);
  const [completedItems, toDoItems] = partition(auditWorklistItems, item => item.completed);
  const items = toDo ? mockToDoAuditWorklist : mockCompletedAuditWorklist;
  const { isWaiting } = useTypedSelector(state => state.async.getWorklist);
  // TODO: If there are no worklist items we need to show error message
  if (isEmpty(items)) {
    return null;
  }

  return (
    <AuditWorklistTabScreen
      items={items}
      dispatch={dispatch}
      navigation={navigation}
      toDo={toDo}
      collapsed={collapsed}
      setCollapsed={setCollapsed}
      refreshing={isWaiting}
    />
  );
};

export default AuditWorklistTab;
