import React, {useState} from 'react';
import {View, FlatList, TouchableOpacity, Animated} from 'react-native';
import SideMenu from 'react-native-side-menu';
import { useRoute } from '@react-navigation/native';
import { WorklistItem } from "../../components/worklistItem/WorklistItem";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import COLOR from "../../themes/Color";
import styles from './Worklist.style';
import { WorklistItemI } from "../../models/WorklistItem";
import { CategorySeparator } from "../../components/worklistItem/CategorySeparator";
import { FilterMenu } from "./FilterMenu";
import { useTypedSelector } from '../../state/reducers/RootReducer';

interface ListItemI {
  item: WorklistItemI
}

interface WorklistProps {
  data: any;
  navigation: any;
  route: any;
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

const dummyData: WorklistItemI[] = [
  {
    exceptionType: 'No sales floor location',
    itemName: 'Dole 100% Pineapple Juice (8.4oz / 24pk)',
    itemNbr: 464033,
    upcNbr: '123456789012',
    catgNbr: 40,
    catgName: 'JUICE - WATER - SPORTS DRINKS',
    isCompleted: false
  },
  {
    exceptionType: 'No sales floor location',
    itemName: 'Member\'s Mark Parmesan Crisps (9.5oz)',
    itemNbr: 980039377,
    upcNbr: '123456789012',
    catgNbr: 46,
    catgName: 'CAN PROTEIN - CONDIMENTS - PASTA',
    isCompleted: false
  }
];

export const convertDataToDisplayList = (data: WorklistItemI[], groupToggle: boolean) => {
  if (!groupToggle) {
    return [{
      exceptionType: 'CATEGORY',
      catgName: 'ALL',
      itemCount: dummyData.length
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
  const route = useRoute();
  const { menuOpen } = useTypedSelector(state => state.WorklistFilter);

  const menu = (
    <FilterMenu />
  )
  console.log(route);
  return (
    <SideMenu
      menu={menu}
      menuPosition="right"
      isOpen={menuOpen}
      animationFunction={(prop, value) => Animated.spring(prop, {
        toValue: value,
        friction: 8,
        useNativeDriver: true
      })
      }
    >
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
    </SideMenu>
  )
};
