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
  deleteFromPrinterList,
  setLocationLabelPrinter as setLocationLabelPrinterAction,
  setPalletLabelPrinter as setPalletLabelPrinterAction,
  setPriceLabelPrinter as setPriceLabelPrinterAction,
  setSelectedPrinter
} from '../../../state/actions/Print';
import { Printer, PrinterType, PrintingType } from '../../../models/Printer';
import { strings } from '../../../locales';
import {
  deletePrinter, setLocationLabelPrinter, setPalletLabelPrinter, setPriceLabelPrinter
} from '../../../utils/asyncStorageUtils';

const ItemSeparator = () => <View style={styles.separator} />;

const mapStateToProps = (state: any) => ({
  printerList: state.Print.printerList,
  printingType: state.Print.selectedPrintingType,
  printingLocationLabels: state.Print.printingLocationLabels,
  printingPalletLabel: state.Print.printingPalletLabel
});

const mapDispatchToProps = {
  setSelectedPrinter,
  deleteFromPrinterList,
  setLocationLabelPrinterAction,
  setPalletLabelPrinterAction,
  setPriceLabelPrinterAction
};

type setPrinterFn = (printer: Printer) => ({ type: string, payload: Printer});

interface PrinterListProps {
  printerList: Printer[];
  printingType: PrintingType | null;
  deleteFromPrinterList: (printerId: string) => ({ type: string, payload: string});
  setSelectedPrinter: setPrinterFn;
  setLocationLabelPrinterAction: setPrinterFn;
  setPriceLabelPrinterAction: setPrinterFn;
  setPalletLabelPrinterAction: setPrinterFn;
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

    const setPortablePrinterForAllLabels = (printer: Printer) => {
      this.props.setPriceLabelPrinterAction(printer);
      setPriceLabelPrinter(printer);
      this.props.setLocationLabelPrinterAction(printer);
      setLocationLabelPrinter(printer);
      this.props.setPalletLabelPrinterAction(printer);
      setPalletLabelPrinter(printer);
    };

    // printingType will only be set if settingsTool is active
    // so we don't have to worry about if settingsTool is enabled here
    const disabled = () => this.props.printingType
      && this.props.printingType !== PrintingType.PRICE_SIGN
      && item.type === PrinterType.LASER;

    const onCardClick = () => {
      if (this.props.printingType) {
        switch (this.props.printingType) {
          case PrintingType.PRICE_SIGN:
            setPriceLabelPrinter(item);
            this.props.setPriceLabelPrinterAction(item);
            break;
          case PrintingType.LOCATION:
            setLocationLabelPrinter(item);
            this.props.setLocationLabelPrinterAction(item);
            break;
          case PrintingType.PALLET:
            setPalletLabelPrinter(item);
            this.props.setPalletLabelPrinterAction(item);
            break;
          default:
            break;
        }
      } else {
        this.props.setSelectedPrinter(item);
        // set the printer to all 3 printers in redux if it is a portable printer to mimic current functionality
        if (item.type === PrinterType.PORTABLE) {
          setPortablePrinterForAllLabels(item);
        } else {
          // when the user switch back to main laser from portable printer for printing price sign
          this.props.setPriceLabelPrinterAction({
            type: PrinterType.LASER,
            name: strings('PRINT.FRONT_DESK'),
            desc: strings('GENERICS.DEFAULT'),
            id: '000000000000',
            labelsAvailable: ['price']
          });
        }
        if (this.props.printingPalletLabel) {
          setPalletLabelPrinter(item);
        } else if (this.props.printingLocationLabels !== '') {
          setLocationLabelPrinter(item);
        } else {
          setPriceLabelPrinter(item);
        }
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
      <TouchableOpacity
        style={disabled() ? styles.disabledCardContainer : styles.cardContainer}
        onPress={onCardClick}
        disabled={disabled()}
      >
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

  selectPrinterMessage = (printingType: PrintingType | null): JSX.Element => {
    switch (printingType) {
      case PrintingType.PRICE_SIGN:
        return (
          <Text>{strings('PRINT.PRINTER_LIST_PRICE')}</Text>
        );
      case PrintingType.LOCATION:
        return (
          <Text>{strings('PRINT.PRINTER_LIST_LOCATION')}</Text>
        );
      case PrintingType.PALLET:
        return (
          <Text>{strings('PRINT.PRINTER_LIST_PALLET')}</Text>
        );
      default:
        return (<></>);
    }
  };

  render(): JSX.Element {
    return (
      <>
        {this.selectPrinterMessage(this.props.printingType)}
        <FlatList
          data={this.props.printerList}
          ItemSeparatorComponent={ItemSeparator}
          renderItem={this.printerListCard}
          style={styles.flatList}
          keyExtractor={(item: any) => item.id.toString()}
        />
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PrinterList);
