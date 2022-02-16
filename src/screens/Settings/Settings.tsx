import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FlatList } from 'react-native-gesture-handler';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import styles from './Settings.style';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { Printer } from '../../models/Printer';

interface SettingsScreenProps {
  printerOpen: boolean;
  togglePrinterList: React.Dispatch<React.SetStateAction<boolean>>;
  featuresOpen: boolean;
  toggleFeaturesList: React.Dispatch<React.SetStateAction<boolean>>;
  priceLabelPrinter: Printer | null;
  locationLabelPrinter: Printer | null;
  palletLabelPrinter: Printer | null;
  userFeatures: string[];
}
interface CollapsibleCardProps {
  title: string;
  isOpened: boolean;
  toggleIsOpened: React.Dispatch<React.SetStateAction<boolean>>
}
const featuresCard = (featureName: string, isEnabled: boolean) => (
  <View style={styles.featureCardContainer}>
    <Text style={styles.featureText}>{featureName}</Text>
    <Text style={styles.featureText}>{isEnabled ? strings('GENERICS.ENABLED') : strings('GENERICS.DISABLED')}</Text>
  </View>
);
const printerCard = (printerTitle: string, printer: Printer | null, changePrinter: () => void) => (
  <View style={styles.printCardContainer}>
    <View>
      <Text style={styles.printCardText}>{printerTitle}</Text>
      <Text>
        {'  '}
        {printer?.name ?? strings('GENERICS.NOT_ASSIGNED')}
      </Text>
    </View>
    <TouchableOpacity style={styles.changeContainer} onPress={changePrinter}>
      <Text style={styles.changeText}>{strings('GENERICS.CHANGE')}</Text>
    </TouchableOpacity>
  </View>
);

const CollapsibleCard = (props: CollapsibleCardProps) => {
  const { title, isOpened, toggleIsOpened } = props;
  const iconName = isOpened ? 'keyboard-arrow-up' : 'keyboard-arrow-down';

  return (
    <>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{ title }</Text>
      </View>
      <TouchableOpacity style={styles.arrowView} onPress={() => toggleIsOpened(!isOpened)}>
        <MaterialIcons name={iconName} size={25} color={COLOR.GREY_700} />
      </TouchableOpacity>
    </>
  );
};

export const SettingsScreen = (props: SettingsScreenProps) => {
  const {
    featuresOpen, printerOpen, toggleFeaturesList, togglePrinterList,
    locationLabelPrinter, palletLabelPrinter, priceLabelPrinter, userFeatures
  } = props;

  const changePrinter = () => {
    // TODO add functionality to change printers
  };
  const appFeatures = [
    {
      key: 'manager approval',
      name: strings('APPROVAL.MANAGER_APPROVAL')
    },
    {
      key: 'location management',
      name: strings('LOCATION.LOCATION_MANAGEMENT')
    },
    {
      key: 'on hands change',
      name: strings('APPROVAL.OH_CHANGE')
    },
    {
      key: 'location management edit',
      name: strings('LOCATION.LOCATION_MGMT_EDIT')
    },
    {
      key: 'location printing',
      name: strings('PRINT.LOCATION_PRINTING')
    },
    {
      key: 'pallet management',
      name: strings('LOCATION.PALLET_MANAGEMENT')
    },
    {
      key: 'picking',
      name: strings('PICKING.PICKING')
    },
    {
      key: 'binning',
      name: strings('BINNING.BINNING')
    }
  ];
  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        <CollapsibleCard
          title="Printers"
          isOpened={printerOpen}
          toggleIsOpened={togglePrinterList}
        />
      </View>
      {printerOpen && (printerCard(strings('PRINT.PRICE_SIGN_PRINTER'), priceLabelPrinter, changePrinter))}
      {printerOpen && (printerCard(strings('PRINT.LOCATION_LABEL_PRINTER'), locationLabelPrinter, changePrinter))}
      {printerOpen && (printerCard(strings('PRINT.PALLET_LABEL_PRINTER'), palletLabelPrinter, changePrinter))}
      <View style={styles.menuContainer}>
        <CollapsibleCard
          title="Features"
          isOpened={featuresOpen}
          toggleIsOpened={toggleFeaturesList}
        />
      </View>
      {featuresOpen && (
      <FlatList
        data={appFeatures}
        renderItem={({ item }) => featuresCard(item.name, userFeatures.some(feature => feature === item.key))}
        keyExtractor={item => item.key}
        ListFooterComponent={<View />}
        ListFooterComponentStyle={styles.footer}
      />
      )}
    </View>
  );
};
const Settings = (): JSX.Element => {
  const [printerOpen, togglePrinterView] = useState(true);
  const [featuresOpen, toggleFeatureList] = useState(true);
  const { priceLabelPrinter, locationLabelPrinter, palletLabelPrinter } = useTypedSelector(state => state.Print);
  const userFeatures = useTypedSelector(state => state.User.features);
  return (
    <SettingsScreen
      printerOpen={printerOpen}
      togglePrinterList={togglePrinterView}
      featuresOpen={featuresOpen}
      toggleFeaturesList={toggleFeatureList}
      priceLabelPrinter={priceLabelPrinter}
      locationLabelPrinter={locationLabelPrinter}
      palletLabelPrinter={palletLabelPrinter}
      userFeatures={userFeatures}
    />
  );
};

export default Settings;
