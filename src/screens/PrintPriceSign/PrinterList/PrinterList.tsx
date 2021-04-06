import React from 'react';
import {
  FlatList, Text, TouchableOpacity, View
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { NavigationProp } from '@react-navigation/native';
import COLOR from '../../../themes/Color';
import styles from './PrinterList.style';
import { deleteFromPrinterList, setSelectedPrinter } from '../../../state/actions/Print';
import { Printer } from '../../../models/Printer';

const ItemSeparator = () => (
  <View style={styles.separator} />
);

const mapStateToProps = (state: any) => ({
  printerList: state.Print.printerList
});

const mapDispatchToProps = {
  setSelectedPrinter,
  deleteFromPrinterList
};

interface PrinterListProps {
  printerList: Printer[];
  deleteFromPrinterList: Function;
  setSelectedPrinter: Function;
  navigation: NavigationProp<any>;
}

export class PrinterList extends React.PureComponent<PrinterListProps> {
  constructor(props: PrinterListProps) {
    super(props);
    this.printerListCard = this.printerListCard.bind(this);
  }

  printerListCard = (cardItem: { item: Printer }) => {
    const { item } = cardItem;
    const onCardClick = () => {
      this.props.setSelectedPrinter(item);
      this.props.navigation.goBack();
    };

    const onDeleteClick = () => {
      this.props.deleteFromPrinterList(item.id);
      // TODO: remove this to replace with some better update after
      this.forceUpdate();
    };

    return (
      <TouchableOpacity style={styles.cardContainer} onPress={onCardClick}>
        <MaterialCommunityIcons name="printer" size={20} color={COLOR.BLACK} />
        <View style={styles.printerDescription}>
          <Text>{item.name}</Text>
        </View>
        {item.id !== '0'
        && (
          <TouchableOpacity style={styles.trashCan} onPress={onDeleteClick}>
            <MaterialCommunityIcons name="trash-can" size={20} color={COLOR.BLACK} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <FlatList
        data={this.props.printerList}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={this.printerListCard}
        style={styles.flatList}
        keyExtractor={(item: any) => item.id.toString()}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PrinterList);
