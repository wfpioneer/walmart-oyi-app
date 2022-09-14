import { NavigationProp, useNavigation } from '@react-navigation/native';
import { groupBy, partition } from 'lodash';
import React, { useState } from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { FlatList } from 'react-native-gesture-handler';
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
}

const renderCategoryCard = (category: string, items: WorklistItemI[]) => (
  <CategoryCard
    category={category}
    listOfItems={items}
    collapsed={false}
    onPress={() => {}}
  />
);

export const AuditWorklistTabScreen = (props: AuditWorklistTabScreenProps) => {
  const { items } = props;
  const itemsBasedOnCategory = groupBy(items, item => `${item.catgNbr} - ${item.catgName}`);
  const sortedItemKeys = Object.keys(itemsBasedOnCategory).sort((a, b) => (a > b ? 1 : -1));
  return (
    <FlatList
      data={sortedItemKeys}
      renderItem={({ item: key }) => renderCategoryCard(key, itemsBasedOnCategory[key])}
      scrollEnabled={false}
      keyExtractor={(item, index) => `category-${item}-${index}`}
    />
  );
};

const AuditWorklistTab = (props: AuditWorklistTabProps) => {
  const { toDo } = props;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [collapsed, setCollapsed] = useState(false);
  const auditWorklistItems = useTypedSelector(state => state.AuditWorklist.items);
  const [completedItems, toDoItems] = partition(auditWorklistItems, item => item.completed);
  return (
    <AuditWorklistTabScreen
      items={toDo ? toDoItems : completedItems}
      dispatch={dispatch}
      navigation={navigation}
      toDo={toDo}
    />
  );
};

export default AuditWorklistTab;
