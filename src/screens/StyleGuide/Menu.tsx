import React from 'react';
import {
  FlatList, Text, TouchableOpacity, View
} from 'react-native';
import styles from './Menu.style';

interface ComponentArrayType {
  component: any;
  menuTitle: string;
}

interface MenuProps {
  onMenuItemSelected: Function;
  componentArray: ComponentArrayType[];
}

interface ItemType {
  item: {
    menuTitle: string;
  };
  index: number;
}

export class Menu extends React.PureComponent<MenuProps> {
  constructor(props: MenuProps) {
    super(props);
    this.renderMenuItem = this.renderMenuItem.bind(this);
  }

  renderMenuItem(itemObject: ItemType) {
    const { item, index } = itemObject;
    return (
      <>
        <TouchableOpacity onPress={() => this.props.onMenuItemSelected(index)} style={styles.menuItem}>
          <Text style={styles.menuItemText}>{item.menuTitle}</Text>
        </TouchableOpacity>
        <View style={styles.separatorView} />
      </>
    );
  }

  render(): React.ReactElement<any> {
    return (
      <FlatList
        data={this.props.componentArray}
        keyExtractor={(item: any) => item.menuTitle}
        renderItem={this.renderMenuItem}
        style={styles.flatList}
      />
    );
  }
}
