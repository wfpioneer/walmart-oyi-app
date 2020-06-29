import React from 'react';
import {
  Animated, FlatList, Text, View
} from 'react-native';
import SideMenu from 'react-native-side-menu';
import { Menu } from './Menu';
import Button from './StyleGuideComponents/Button';
import TextInput from './StyleGuideComponents/Textinput';
import styles from './StyleGuide.style';
import TitleStyleGuide from './StyleGuideComponents/Title';

/*
 * EDIT ME!
 * ADD ANY COMPONENTS YOU WANT VISIBLE IN THE COMPONENT ARRAY BELOW
 */

const componentArray: ComponentArrayType[] = [
  { component: Button, menuTitle: 'Button' },
  { component: TextInput, menuTitle: 'TextInput' },
  { component: TitleStyleGuide, menuTitle: 'Title' }
];

/*
 * DON'T EDIT ME BELOW! (unless you have to)
 */

interface ComponentArrayType {
  component: any;
  menuTitle: string;
}

interface StyleGuideProps {
  navigation: any;
  route: any;
}

interface StyleGuideState {
  isOpen: boolean;
}

export class StyleGuide extends React.PureComponent<StyleGuideProps, StyleGuideState> {
  private flatListRef: any;

  saveListRef = (ref: any) => { this.flatListRef = ref; };

  onMenuItemSelected = (itemIndex: number) => {
    this.props.navigation.setParams({ menuOpen: false });
    this.flatListRef.scrollToIndex({ animated: false, index: itemIndex, viewOffset: 10 });
  };

  renderComponentItem = (itemParent: any) => {
    const { item } = itemParent;
    return (
      <View style={styles.componentContainer}>
        <View style={styles.componentHeader}>
          <Text style={styles.componentHeaderText}>{ item.menuTitle }</Text>
        </View>
        <View style={styles.component}>
          <item.component />
        </View>
        <View style={styles.bottomSeparator} />
      </View>
    );
  };

  render(): React.ReactElement<any> {
    const menu = (
      <Menu onMenuItemSelected={this.onMenuItemSelected} componentArray={componentArray} />
    );
    const { params } = this.props.route;
    return (
      <SideMenu
        menu={menu}
        menuPosition="right"
        isOpen={params.menuOpen}
        animationFunction={(prop, value) => Animated.spring(prop, {
          toValue: value,
          friction: 8,
          useNativeDriver: true
        })
        }
      >
        <FlatList
          removeClippedSubviews
          ref={this.saveListRef}
          data={componentArray}
          renderItem={this.renderComponentItem}
          keyExtractor={(item: ComponentArrayType) => item.menuTitle}
          style={styles.container}
        />
      </SideMenu>
    );
  }
}

export default StyleGuide;
