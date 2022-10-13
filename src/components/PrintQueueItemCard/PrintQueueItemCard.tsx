import React from 'react';
import {
  GestureResponderEvent, Text, TouchableOpacity, View
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { strings } from '../../locales';
import { COLOR } from '../../themes/Color';
import styles from './PrintQueueItemCard.style';

export interface PrintQueueItemCardProp {
  jobName: string
  nbrOfCopies: number,
  size?: string,
  editCallback: () => void,
  deleteCallback: () => void,
  isSizeValid: boolean
}

const PrintQueueItemCard = (props: PrintQueueItemCardProp) : JSX.Element => {
  const {
    jobName,
    nbrOfCopies,
    size,
    editCallback,
    deleteCallback,
    isSizeValid
  } = props;

  const renderActionIcon = (name: string, action?: (event: GestureResponderEvent) => void) => (
    <TouchableOpacity style={styles.icon} onPress={action}>
      <View>
        <MaterialCommunityIcon name={name} size={26} color={COLOR.TRACKER_GREY} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[isSizeValid ? styles.container : styles.errorContainer]}>
      <View style={styles.content}>
        <View style={styles.itemContainer}>
          <Text style={styles.textHeader}>
            {jobName}
          </Text>
          <Text style={styles.itemSize}>
            {strings(`PRINT.${size}`)}
          </Text>
        </View>
        <View style={styles.itemHeaderFirstRow}>
          <Text style={styles.textHeaderRows}>
            {`${strings('PRINT.COPIES')}: ${nbrOfCopies}`}
          </Text>
          {renderActionIcon('pencil', editCallback)}
          {renderActionIcon('trash-can', deleteCallback)}
        </View>
      </View>
    </View>
  );
};

export default PrintQueueItemCard;
