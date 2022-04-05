import React, { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  Text,
  View
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import ItemInfo from '../../components/iteminfo/ItemInfo';
import NumericSelector from '../../components/NumericSelector/NumericSelector';
import Button from '../../components/buttons/Button';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import ItemDetails from '../../models/ItemDetails';
import Location from '../../models/Location';
import { strings } from '../../locales';
import styles from './CreatePick.style';

export const MOVE_TO_FRONT = 'moveToFront';
export const PALLET_MIN = 1;
export const PALLET_MAX = 99;

interface CreatePickProps {
  item: ItemDetails;
  selectedSectionState: [string, React.Dispatch<React.SetStateAction<string>>]
  palletNumberState: [number, React.Dispatch<React.SetStateAction<number>>]
  floorLocations: Location[];
}

export const CreatePickScreen = (props: CreatePickProps) => {
  const {
    item, selectedSectionState, palletNumberState, floorLocations
  } = props;

  const [selectedSection, setSelectedSection] = selectedSectionState;
  const [palletNumber, setPalletNumber] = palletNumberState;

  const pickerLocations = (locations: Location[]) => [
    <Picker.Item label={strings('PICKING.SELECT_LOCATION')} value="" key={-1} />,
    ...locations.map((location: Location) => (
      <Picker.Item label={location.locationName} value={location.locationName} key={location.locationName} />
    )),
    <Picker.Item label={strings('PICKING.MOVE_TO_FRONT')} value={MOVE_TO_FRONT} key={MOVE_TO_FRONT} />
  ];

  const onPalletIncrease = (
    numberOfPallets: number,
    setNumberOfPallets: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (numberOfPallets < PALLET_MAX) {
      setNumberOfPallets((previousState: number) => previousState + 1);
    }
  };

  const onPalletDecrease = (
    numberOfPallets: number,
    setNumberOfPallets: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (numberOfPallets > PALLET_MIN) {
      setNumberOfPallets((previousState: number) => previousState - 1);
    }
  };

  const onPalletTextChange = (text: string, setNumberOfPallets: React.Dispatch<React.SetStateAction<number>>) => {
    const newQty = parseInt(text, 10);
    if (!Number.isNaN(newQty) && newQty >= PALLET_MIN && newQty <= PALLET_MAX) {
      setNumberOfPallets(newQty);
    }
  };

  const isNumberOfPalletsValid = (numberOfPallets: number) => (
    numberOfPallets >= PALLET_MIN && numberOfPallets <= PALLET_MAX
  );

  const disableCreateButton = () => !selectedSection || !item.location.reserve;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.itemDetailsView}>
        <ItemInfo
          category={`${item.categoryNbr} - ${item.categoryDesc}`}
          itemName={item.itemName}
          itemNbr={item.itemNbr}
          upcNbr={item.upcNbr}
          price={item.price}
          status={item.status || ''}
          hidePrintButton={true}
        />
      </View>
      <View style={styles.pickParamView}>
        <View style={styles.pickParamLine}>
          <MaterialCommunityIcons name="map-marker-outline" size={40} />
          <Text>{strings('ITEM.LOCATION')}</Text>
          <Pressable onPress={() => {}} style={styles.pickLocationAddButton}>
            <Text style={styles.pickLocationAddText}>{strings('GENERICS.ADD')}</Text>
          </Pressable>
        </View>
        <View style={styles.pickParamLine}>
          <Text>{strings('PICKING.RESERVE_LOC')}</Text>
          <Text>{item.location.reserve && item.location.reserve[0].locationName}</Text>
        </View>
        <View style={styles.pickParamLine}>
          <Text>{strings('PICKING.FLOOR_LOC')}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedSection}
              onValueChange={section => setSelectedSection(section)}
              mode="dropdown"
            >
              {pickerLocations(floorLocations)}
            </Picker>
          </View>
        </View>
        <View style={styles.pickParamLine}>
          <Text>{strings('PICKING.NUMBER_PALLETS')}</Text>
          <NumericSelector
            isValid={isNumberOfPalletsValid(palletNumber)}
            onDecreaseQty={() => onPalletDecrease(palletNumber, setPalletNumber)}
            onIncreaseQty={() => onPalletIncrease(palletNumber, setPalletNumber)}
            onTextChange={(text: string) => onPalletTextChange(text, setPalletNumber)}
            minValue={PALLET_MIN}
            maxValue={PALLET_MAX}
            value={palletNumber}
          />
        </View>
      </View>
      <View style={styles.createButtonView}>
        <Button title={strings('GENERICS.CREATE')} disabled={disableCreateButton()} />
      </View>
    </SafeAreaView>
  );
};

const CreatePick = () => {
  const picking = useTypedSelector(state => state.Picking);
  const floorLocations = useTypedSelector(state => state.ItemDetailScreen.floorLocations);
  const selectedSectionState = useState('');
  const palletNumberState = useState(1);

  const mockLocations: Location[] = [
    {
      aisleId: 2,
      aisleName: '1',
      locationName: 'ABAR1-1',
      sectionId: 3,
      sectionName: '1',
      type: 'floor',
      typeNbr: 2,
      zoneId: 1,
      zoneName: 'ABAR'
    },
    {
      aisleId: 2,
      aisleName: '2',
      locationName: 'ABAR1-2',
      sectionId: 4,
      sectionName: '2',
      type: 'floor',
      typeNbr: 2,
      zoneId: 1,
      zoneName: 'ABAR'
    }
  ];

  // May need to change this as not all item details are stored in item details redux
  const mockItem: ItemDetails = {
    categoryNbr: 73,
    itemName: 'treacle tart',
    itemNbr: 2,
    upcNbr: '8675309',
    backroomQty: 765432,
    basePrice: 4.92,
    categoryDesc: 'Deli',
    claimsOnHandQty: 765457,
    completed: false,
    consolidatedOnHandQty: 65346,
    location: {
      reserve: [
        {
          aisleId: 5018,
          aisleName: '1',
          locationName: 'ABAR1-1',
          sectionId: 5019,
          sectionName: '1',
          type: 'reserve',
          typeNbr: 1,
          zoneId: 3632,
          zoneName: 'ABAR'
        }
      ],
      count: 1
    },
    onHandsQty: 76543234,
    pendingOnHandsQty: 2984328947,
    price: 4.92,
    replenishment: {
      onOrder: 100000
    },
    sales: {
      daily: [{
        day: 'Thursday',
        value: 3
      }],
      dailyAvgSales: 500,
      lastUpdateTs: 'right now',
      weekly: [{
        week: 34,
        value: 654
      }],
      weeklyAvgSales: 3500
    }
  };

  return (
    <CreatePickScreen
      item={mockItem}
      selectedSectionState={selectedSectionState}
      palletNumberState={palletNumberState}
      floorLocations={mockLocations}
    />
  );
};

export default CreatePick;
