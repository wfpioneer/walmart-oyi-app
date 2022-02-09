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
import {
  deletePrinter, setLocationLabelPrinter, setPalletLabelPrinter, setPriceLabelPrinter
} from '../../../utils/asyncStorageUtils';

const ItemSeparator = () => <View style={styles.separator} />;

const mapStateToProps = (state: any) => ({
  printerList: state.Print.printerList
});

const mapDispatchToProps = {
  setSelectedPrinter,
  deleteFromPrinterList
};

interface PrinterListProps {
  printerList: Printer[];
  deleteFromPrinterList: (printerId: string) => void;
  setSelectedPrinter: (printer: Printer) => void;
  navigation: NavigationProp<any>;
  printingLocationLabels: string;
  printingPalletLabel: boolean;
}

export class PrinterList extends React.PureComponent<PrinterListProps> {
  constructor(props: PrinterListProps) {
    super(props);
    this.printerListCard = this.printerListCard.bind(this);
  }

  printerListCard = (cardItem: { item: Printer }): JSX.Element => {
    const { item } = cardItem;
    const onCardClick = () => {
      this.props.setSelectedPrinter(item);
      if (this.props.printingPalletLabel) {
        setPalletLabelPrinter(item);
      } else if (this.props.printingLocationLabels !== '') {
        setLocationLabelPrinter(item);
      } else {
        setPriceLabelPrinter(item);
      }
      this.props.navigation.goBack();
    };

    const onDeleteClick = () => {
      this.props.deleteFromPrinterList(item.id);
      deletePrinter(item.id);
      // TODO: remove this to replace with some better update after
      this.forceUpdate();
    };

    return (
      <TouchableOpacity style={styles.cardContainer} onPress={onCardClick}>
        <MaterialCommunityIcons name="printer" size={20} color={COLOR.BLACK} />
        <View style={styles.printerDescription}>
          <Text>{item.name}</Text>
        </View>
        {item.id !== '000000000000' && (
          <TouchableOpacity style={styles.trashCan} onPress={onDeleteClick}>
            <MaterialCommunityIcons
              name="trash-can"
              size={20}
              color={COLOR.BLACK}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  render(): JSX.Element {
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
