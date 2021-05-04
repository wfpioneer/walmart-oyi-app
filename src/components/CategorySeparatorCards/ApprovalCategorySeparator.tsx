import React from 'react';
import { Text, View } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { Dispatch } from 'redux';
import { toggleCategory } from '../../state/actions/Approvals';
import COLOR from '../../themes/Color';
import styles from './ApprovalCategorySeparator.style';

interface CategoryProps{
  categoryNbr: number;
  categoryName: string;
  isChecked?: boolean;
  dispatch: Dispatch<any>;
}

export const ApprovalCategorySeparator = (props: CategoryProps) => {
  const {
    categoryName, categoryNbr, isChecked, dispatch
  } = props;

  return (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryName}>
        {`${categoryNbr} - ${categoryName}`}
      </Text>
      <View style={styles.checkBox}>
        <Checkbox
          status={isChecked ? 'checked' : 'unchecked'}
          onPress={() => dispatch(toggleCategory(categoryNbr, !isChecked))}
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
