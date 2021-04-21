import React from 'react';
import { Text, View } from 'react-native';
import { Checkbox } from 'react-native-paper';
import COLOR from '../../themes/Color';
import styles from './ApprovalCategorySeparator.style';

interface CategoryProps{
  categoryNbr: number;
  categoryName: string;
  isChecked?: boolean;
}

export const ApprovalCategorySeparator = (props: CategoryProps) => {
  const { categoryName, categoryNbr, isChecked } = props;

  return (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryName}>
        {`${categoryNbr} - ${categoryName}`}
      </Text>
      <View style={styles.checkBox}>
        <Checkbox
          status={isChecked ? 'checked' : 'unchecked'}
          onPress={() => undefined} // TODO toggleItems by Category https://jira.walmart.com/browse/INTLSAOPS-2677
          color={COLOR.MAIN_THEME_COLOR}
          uncheckedColor={COLOR.MAIN_THEME_COLOR}
        />
      </View>
    </View>
  );
};

ApprovalCategorySeparator.defaultProps = {
  isChecked: false
};
