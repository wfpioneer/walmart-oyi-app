import { NavigationProp, Route } from '@react-navigation/native';
import React, { Dispatch } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { strings } from '../../locales';
import { PrintQueueItem } from '../../models/Printer';
import COLOR from '../../themes/Color';
import { validateSession } from '../../utils/sessionTimeout';
import IconButton from '../buttons/IconButton';
import styles from './PrintListCard.style';

interface PrintListCardProps {
  printQueue?: PrintQueueItem[],
  item: PrintQueueItem,
  setItemIndexToEdit?: React.Dispatch<React.SetStateAction<number>>,
  dispatch?: Dispatch<any>,
  navigation?: NavigationProp<any>,
  route?: Route<any>,
  validateSessionCall?: (nav: NavigationProp<any>, routeName?: string) => Promise<void>,
  trackEventCall?: (eventName: string, params?: any) => void
}
const PrintListCard = (props: PrintListCardProps): JSX.Element => {
  const {
    printQueue,
    item,
    setItemIndexToEdit,
    dispatch,
    navigation,
    route,
    validateSessionCall,
    trackEventCall
  } = props;
  // const handleEditAction = (index: number) => () => {
  //   setItemIndexToEdit(index);
  // };
  // const handleDeleteAction = (index: number) => () => {
  //   validateSession(navigation, route.name).then(() => {
  //     trackEventCall('print_queue_delete_item', { printItem: JSON.stringify(printQueue[index]) });
  //     printQueue.splice(index, 1);
  //     dispatch(setPrintQueue(printQueue));
  //   }).catch(() => {});
  // };
  return (
    <View style={[styles.itemContainer, styles.itemContainerBorder]}>
      <View style={styles.itemDetailsContainer}>
        <Text style={styles.itemDescText}>{item.itemName}</Text>
        <Text style={styles.sizeText}>{`${strings('PRINT.SIGN_SIZE')}: ${strings(`PRINT.${item.paperSize}`)}`}</Text>
        <View style={styles.itemBottomRowContainer}>
          <Text style={styles.copiesText}>{`${strings('PRINT.COPIES')}: ${item.signQty}`}</Text>
          <View style={styles.actionBtnContainer}>
            <IconButton
              icon={<MaterialCommunityIcons name="pencil" color={COLOR.GREY_700} size={24} />}
              type={IconButton.Type.NO_BORDER}
              onPress={() => console.log('Edit')}
            />
            <IconButton
              icon={<MaterialCommunityIcons name="delete" color={COLOR.GREY_700} size={24} />}
              type={IconButton.Type.NO_BORDER}
              onPress={() => console.log('Delete')}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default PrintListCard;
