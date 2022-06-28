import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import MissingPalletWorklistCard from '../../components/MissingPalletWorklistCard/MissingPalletWorklistCard';
import { strings } from '../../locales';
import { MissingPalletWorklistItemI } from '../../models/WorklistItem';
import { CustomModalComponent } from '../Modal/Modal';
import { styles } from './PalletWorklist.style';
import Button from '../../components/buttons/Button';
import COLOR from '../../themes/Color';

interface PalletWorkListProps {
  palletWorklist: MissingPalletWorklistItemI[];
  displayConfirmation: boolean;
  setDisplayConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
}
const onDeletePress = () => {};
export const PalletWorklistScreen = (props: PalletWorkListProps) => {
  const { displayConfirmation, palletWorklist, setDisplayConfirmation } = props;
  return (
    <View style={styles.container}>
      <CustomModalComponent
        isVisible={displayConfirmation}
        modalType="FormHeader"
        onClose={() => {}}
      >
        <View style={styles.delHeader}>
          <Text style={styles.message}>
            {strings('MISSING_PALLET_WORKLIST.DELETE_PALLET')}
          </Text>
        </View>
        <Text style={styles.delText}>
          {strings('MISSING_PALLET_WORKLIST.DELETE_PALLET_CONFIRMATION')}
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            style={styles.delButton}
            title={strings('GENERICS.CANCEL')}
            backgroundColor={COLOR.MAIN_THEME_COLOR}
            onPress={() => setDisplayConfirmation(false)}
          />
          <Button
            style={styles.delButton}
            title={strings('GENERICS.OK')}
            backgroundColor={COLOR.TRACKER_RED}
            onPress={undefined}
          />
        </View>
      </CustomModalComponent>
      <FlatList
        data={palletWorklist}
        keyExtractor={(item: MissingPalletWorklistItemI, index: number) => item.palletId + index.toString()}
        renderItem={({ item }) => (
          <MissingPalletWorklistCard
            palletId={item.palletId}
            lastLocation={item.lastKnownLocationName}
            reportedBy={item.createId}
            reportedDate={item.createTS}
            expanded={true}
            addCallback={() => {}}
            deleteCallback={() => setDisplayConfirmation(true)}
            navigateCallback={() => {}}
          />
        )}
        onRefresh={null}
        refreshing={undefined}
        style={styles.list}
      />
    </View>
  );
};

export const PalletWorkList = () => {
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const mockMPWorklist: MissingPalletWorklistItemI[] = [
    {
      createId: '11',
      createTS: '26/06/2022',
      lastKnownLocationId: 1,
      lastKnownLocationName: 'A1-1',
      palletDeleted: false,
      palletId: 7988,
      worklistType: 'MP',
      completed: undefined,
      completedId: undefined,
      completedTS: undefined
    }
  ];
  return (
    <PalletWorklistScreen
      palletWorklist={mockMPWorklist}
      displayConfirmation={displayConfirmation}
      setDisplayConfirmation={setDisplayConfirmation}
    />
  );
};
