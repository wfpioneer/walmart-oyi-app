import React from 'react';
import { ScrollView, View, Text } from "react-native";
import styles from './FilterMenu.style';

interface MenuCardProps {
  title: string;
  subtext: string;
}

export const MenuCard = (props: MenuCardProps) => {
  return (
    <View style={styles.menuCard}>
      <Text>
        { props.title }
      </Text>
      <Text>
        { props.subtext }
      </Text>
    </View>
  )
}

export const renderCategoryCard = () => {
  return (
    <MenuCard title='Category' subtext='All' />
  )
}

export const renderExceptionTypeCard = () => {
  return (
    <MenuCard title='Exception Type' subtext='All' />
  )
}

export const FilterMenu = () => {
  return (
    <ScrollView style={styles.menuContainer}>
      { renderCategoryCard() }
      { renderExceptionTypeCard() }
    </ScrollView>
  );
};
