import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Checkbox } from 'react-native-paper';
import COLOR from '../../themes/Color';
import styles from './ApprovalCategorySeparator.style';

interface CategoryProps{
  categoryNbr: number;
  categoryName: string;
}
export const ApprovalCategorySeparator = (props: CategoryProps) => {
  const { categoryName, categoryNbr } = props;
  // TODO The CheckBox will need to be changed for the `Select/Deselect All` tasks and have proper tests
  const [checked, setChecked] = useState(false);

  return (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryName}>
        {`${categoryNbr} - ${categoryName}`}
      </Text>
      <View style={styles.checkBox}>
        <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => setChecked(!checked)}
          color={COLOR.MAIN_THEME_COLOR}
          uncheckedColor={COLOR.MAIN_THEME_COLOR}
        />
      </View>
    </View>
  );
};
