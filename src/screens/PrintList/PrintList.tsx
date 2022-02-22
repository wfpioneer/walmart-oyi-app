import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/buttons/Button';
import PrintListCard from '../../components/PrintListCard/PrintListCard';
import { strings } from '../../locales';
import styles from './PrintList.style';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { PrintQueueItem, Printer } from '../../models/Printer';

interface PrintListProps {
  selectedPrinter: Printer | null;
  printQueue: PrintQueueItem[];
}
export const PrintListsScreen = (props: PrintListProps): JSX.Element => {
  const { selectedPrinter, printQueue } = props;
  return (
    <View style={styles.container}>
      <FlatList
        data={printQueue}
        renderItem={({ item }) => <PrintListCard item={item} />}
        keyExtractor={(item: PrintQueueItem) => item?.itemName}
      />
      <View style={styles.footerContainer}>
        <View style={styles.printerNameContainer}>
          <View style={styles.printTextMargin}>
            <MaterialCommunityIcons name="printer-check" size={24} />
            <Text style={styles.printerName}>{selectedPrinter?.name}</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.changeButton}>{strings('GENERICS.CHANGE')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonView}>
          <Button
            title={strings('PRINT.PRINT')}
            type={Button.Type.PRIMARY}
            style={styles.footerBtn}
            onPress={() => console.log('Print')}
          />
        </View>
      </View>
    </View>
  );
};

const PrintLists = (props: {printQueue: PrintQueueItem[]}): JSX.Element => {
  const {
    locationLabelPrinter, priceLabelPrinter, printingLocationLabels
  } = useTypedSelector(state => state.Print);
  const route = useRoute();

  // Filter by tab
  const getSelectedPrinterBasedOnLabel = () => {
    if (printingLocationLabels) {
      return locationLabelPrinter;
    }
    return priceLabelPrinter;
  };
  return (
    <PrintListsScreen
      selectedPrinter={getSelectedPrinterBasedOnLabel()}
      printQueue={props.printQueue}
    />
  );
};

export default PrintLists;
