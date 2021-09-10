import React, {Fragment} from 'react';
import {View, Text} from 'react-native';
import styles from './ItemDetailsList.style';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import COLOR from '../../themes/Color';

const INFO_ICON_SIZE = 12;
const INDENTED_LEFT_PADDING = 30;

export interface ItemDetailsListRow {
  label: string;
  value: string | number;
  additionalNote?: string;
}

interface ItemDetailsListProps {
  rows: ItemDetailsListRow[];
  indentAfterFirstRow?: boolean;
}

const ItemDetailsList = (props: ItemDetailsListProps): JSX.Element => {
  const {rows, indentAfterFirstRow} = props;

  return (
    <View style={styles.listContainer}>
      {rows.map((row, idx) => {
        return (
          <Fragment key={row.label}>
            <View
              style={[
                styles.listRowContainer,
                {borderTopWidth: idx === 0 ? 0 : 1},
                indentAfterFirstRow &&
                  idx > 0 && {paddingLeft: INDENTED_LEFT_PADDING},
              ]}
              key={row.label}>
              <Text>{row.label}</Text>
              <Text>{row.value}</Text>
            </View>
            {row.additionalNote && (
              <View style={styles.additionalInfoContainer}>
                <FontAwesome5Icon
                  name="info-circle"
                  size={INFO_ICON_SIZE}
                  color={COLOR.GREY_700}
                  style={styles.infoIcon}
                />
                <Text>{row.additionalNote}</Text>
              </View>
            )}
          </Fragment>
        );
      })}
    </View>
  );
};

export default ItemDetailsList;
