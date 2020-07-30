import React, {useState} from 'react';
import {View, FlatList, TouchableOpacity, Animated} from 'react-native';
import { WorklistItem } from "../../components/worklistItem/WorklistItem";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import COLOR from "../../themes/Color";
import styles from './Worklist.style';
import { WorklistItemI } from "../../models/WorklistItem";
import { CategorySeparator } from "../../components/worklistItem/CategorySeparator";

interface ListItemI {
  item: WorklistItemI
}

interface WorklistProps {
  data: any;
}

export const renderWorklistItem = (listItem: ListItemI) => {
  if (listItem.item.exceptionType === 'CATEGORY') {
    const { catgName, catgNbr, itemCount } = listItem.item;
    return (
      <CategorySeparator categoryName={catgName} categoryNumber={catgNbr} numberOfItems={itemCount} />
    )
  }
  const { exceptionType, itemName, itemNbr } = listItem.item;

  return (
    <WorklistItem
      exceptionType={exceptionType}
      itemDescription={itemName}
      itemNumber={itemNbr}
    />
  );
}

export const convertDataToDisplayList = (data: WorklistItemI[], groupToggle: boolean) => {
  if (!groupToggle) {
    return [{
      exceptionType: 'CATEGORY',
      catgName: 'ALL',
      itemCount: data.length
    },
      ...data];
  }

  const sortedData = data;
  // first, sort by category number
  sortedData.sort((firstEl: WorklistItemI, secondEl: WorklistItemI) => {
    return firstEl.catgNbr - secondEl.catgNbr;
  });

  const returnData = [];

  // next, insert into the array where the category numbers change
  const iterator = sortedData.values();
  let previousItem: WorklistItemI | undefined = undefined;
  let previousCategoryIndex: any = undefined;
  for (const item of iterator) {
    if (!previousItem || (previousItem.catgNbr !== item.catgNbr)) {
      previousItem = item;
      returnData.push({
        exceptionType: 'CATEGORY',
        catgName: item.catgName,
        catgNbr: item.catgNbr,
        itemCount: 1
      });
      previousCategoryIndex = returnData.length - 1;
      returnData.push(item);
    } else {
      previousItem = item;
      if (returnData[previousCategoryIndex].itemCount) {
        // @ts-ignore
        returnData[previousCategoryIndex].itemCount += 1;
      }
      returnData.push(item);
    }
  }

  return returnData;
};

export const Worklist = (props: WorklistProps) => {
  const [groupToggle, updateGroupToggle] = useState(false);

  return (
    <View style={ styles.container }>
      <View style={ styles.viewSwitcher }>
        <TouchableOpacity onPress={() => updateGroupToggle(false)} >
          <MaterialIcons
            name='menu'
            size={ 25 }
            color={!groupToggle ? COLOR.BLACK : COLOR.GREY}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => updateGroupToggle(true)} >
          <MaterialIcons
            name='list'
            size={ 25 }
            color={groupToggle ? COLOR.BLACK : COLOR.GREY}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={convertDataToDisplayList(props.data, groupToggle)}
        keyExtractor={ (item: any) => {
          if (item.exceptionType === 'CATEGORY') {
            return item.catgName.toString()
          }
          return item.itemNbr.toString()
        } }
        renderItem={ renderWorklistItem }
        style={ styles.list }
      />
    </View>
  );
};
