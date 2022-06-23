import React, { useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import COLOR from '../../themes/Color';
import styles from './PalletWorklist.style';

interface PalletWorklistProps {
  groupToggle: boolean;
  updateGroupToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PalletWorklist = (props: PalletWorklistProps): JSX.Element => {
  const { groupToggle, updateGroupToggle } = props;

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <FlatList
          data={[]} // TODO FilterPill Buttons
          horizontal
          renderItem={undefined}
          style={styles.filterList}
          keyExtractor={undefined}
        />
      </View>
      <View style={styles.viewSwitcher}>
        <TouchableOpacity
          onPress={() => updateGroupToggle(false)}
          testID="menu"
        >
          <MaterialIcons
            name="menu"
            size={25}
            color={!groupToggle ? COLOR.BLACK : COLOR.GREY}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => updateGroupToggle(true)} testID="list">
          <MaterialIcons
            name="list"
            size={25}
            color={groupToggle ? COLOR.BLACK : COLOR.GREY}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={[]} // MissingPalletWorklist Items
        horizontal
        renderItem={undefined}
        style={styles.filterList}
        keyExtractor={undefined}
      />
    </View>
  );
};

export const TodoPalletWorklist = () => {
  const [groupToggle, updateGroupToggle] = useState(false);
  return (
    <PalletWorklist
      groupToggle={groupToggle}
      updateGroupToggle={updateGroupToggle}
    />
  );
};

export const CompletePalletWorklist = () => {
  const [groupToggle, updateGroupToggle] = useState(false);
  return (
    <PalletWorklist
      groupToggle={groupToggle}
      updateGroupToggle={updateGroupToggle}
    />
  );
};
