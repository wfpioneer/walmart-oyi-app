import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { strings } from '../locales';
import { PrintQueueItem } from '../models/Printer';
import PrintLists from '../screens/PrintList/PrintList';
import { useTypedSelector } from '../state/reducers/RootReducer';

interface PrintListNavigatorProps {
  locationPrintQueue: PrintQueueItem[];
  printQueue: PrintQueueItem[];
}
const Tab = createMaterialTopTabNavigator();

export const PrintListTabNavigator = (props: PrintListNavigatorProps): JSX.Element => (
  <Tab.Navigator>
    <Tab.Screen
      name="PriceSigns"
      options={{
        title: strings('PRINT.PRICE_SIGNS')
      }}
    >
      {() => <PrintLists printQueue={props.printQueue} />}
    </Tab.Screen>
    <Tab.Screen
      name="Locations"
      options={{
        title: strings('PRINT.LOCATIONS')
      }}
    >
      {() => <PrintLists printQueue={props.locationPrintQueue} />}
    </Tab.Screen>
  </Tab.Navigator>
);

const PrintListTabs = (): JSX.Element => {
  const { locationPrintQueue, printQueue } = useTypedSelector(state => state.Print);
  return (
    <PrintListTabNavigator
      locationPrintQueue={locationPrintQueue}
      printQueue={printQueue}
    />
  );
};

export default PrintListTabs;
