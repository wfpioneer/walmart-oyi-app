import { NavigationProp, useNavigation } from '@react-navigation/native';
import { groupBy, isEmpty, partition } from 'lodash';
import React, { useState } from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { FlatList } from 'react-native-gesture-handler';
import CollapseAllBar from '../../components/CollapseAllBar/CollapseAllBar';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { WorklistItemI } from '../../models/WorklistItem';
import CategoryCard from '../../components/CategoryCard/CategoryCard';

export interface AuditWorklistTabProps {
    toDo: boolean;
}

export interface AuditWorklistTabScreenProps {
    items: WorklistItemI[];
    navigation: NavigationProp<any>;
    dispatch: Dispatch<any>;
    toDo: boolean;
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

const renderCategoryCard = (category: string, items: WorklistItemI[], collapsed: boolean) => (
  <CategoryCard
    category={category}
    listOfItems={items}
    collapsed={collapsed}
  />
);

export const AuditWorklistTabScreen = (props: AuditWorklistTabScreenProps) => {
  const { items, collapsed, setCollapsed } = props;
  const itemsBasedOnCategory = groupBy(items, item => `${item.catgNbr} - ${item.catgName}`);
  const sortedItemKeys = Object.keys(itemsBasedOnCategory).sort((a, b) => (a > b ? 1 : -1));
  return (
    <>
      <CollapseAllBar collapsed={collapsed} onclick={() => setCollapsed(!collapsed)} />
      <FlatList
        data={sortedItemKeys}
        renderItem={({ item: key }) => renderCategoryCard(key, itemsBasedOnCategory[key], collapsed)}
        scrollEnabled={false}
        keyExtractor={item => `category-${item}`}
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
  const items = toDo ? toDoItems : completedItems;
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
    />
  );
};

export default AuditWorklistTab;
