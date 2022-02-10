import React from 'react';
import {
  FlatList, Text, TouchableOpacity, View
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { NavigationProp } from '@react-navigation/native';
import COLOR from '../../../themes/Color';
import styles from './PrinterList.style';
import {
  deleteFromPrinterList, setLocationLabelPrinter,
  setPalletLabelPrinter, setPriceLabelPrinter, setSelectedPrinter
} from '../../../state/actions/Print';
import { Printer, PrinterType } from '../../../models/Printer';
import { strings } from '../../../locales';

const ItemSeparator = () => (
  <View style={styles.separator} />
);

const mapStateToProps = (state: any) => ({
  printerList: state.Print.printerList
});

const mapDispatchToProps = {
  setSelectedPrinter,
  deleteFromPrinterList,
  setLocationLabelPrinter,
  setPriceLabelPrinter,
  setPalletLabelPrinter
};

type setPrinterFn = (printer: Printer) => ({ type: string, payload: Printer});

interface PrinterListProps {
  printerList: Printer[];
  deleteFromPrinterList: (printerId: string) => ({ type: string, payload: string});
  setSelectedPrinter: setPrinterFn;
  setLocationLabelPrinter: setPrinterFn;
  setPriceLabelPrinter: setPrinterFn;
  setPalletLabelPrinter: setPrinterFn;
  navigation: NavigationProp<any>;
}

export class PrinterList extends React.PureComponent<PrinterListProps> {
  constructor(props: PrinterListProps) {
    super(props);
    this.printerListCard = this.printerListCard.bind(this);
  }

  printerListCard = (cardItem: { item: Printer }) => {
    const { item } = cardItem;

    const setPortablePrinterForAllLabels = (printer: Printer) => {
      this.props.setPriceLabelPrinter(printer);
      this.props.setLocationLabelPrinter(printer);
      this.props.setPalletLabelPrinter(printer);
    };

    const onCardClick = () => {
      this.props.setSelectedPrinter(item);
      // set the printer to all 3 printers in redux if it is a portable printer to mimic current functionality
      if (item.type === PrinterType.PORTABLE) {
        setPortablePrinterForAllLabels(item);
      } else {
        // when the user switch back to main laser from portable printer for printing price sign
        this.props.setPriceLabelPrinter({
          type: PrinterType.LASER,
          name: strings('PRINT.FRONT_DESK'),
          desc: strings('GENERICS.DEFAULT'),
          id: '000000000000',
          labelsAvailable: ['price']
        });
      }
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
        {item.id !== '000000000000'
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
