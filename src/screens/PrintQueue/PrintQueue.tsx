import React, { useState } from 'react';
import {
  Image, Modal, SafeAreaView, ScrollView, Text, View
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import styles from './PrintQueue.styles';
import { PrintQueueItem } from '../../models/Printer';
import IconButton from '../../components/buttons/IconButton';
import Button from '../../components/buttons/Button';
import COLOR from '../../themes/Color';
import { setPrintQueue } from '../../state/actions/Print';
import { strings } from '../../locales';
import PrintQueueEdit from '../../components/printqueueedit/PrintQueueEdit';

const renderPrintItem = (printQueue: PrintQueueItem[], setItemIndexToEdit: Function, dispatch: Function) => {
  const handleEditAction = (index: number) => () => {
    setItemIndexToEdit(index);
  };

  const handleDeleteAction = (index: number) => () => {
    printQueue.splice(index, 1);
    dispatch(setPrintQueue(printQueue));
  };

  return printQueue.map((item, index) => (
    <View key={index} style={[styles.itemContainer, index < printQueue.length - 1 ? styles.itemContainerBorder : {}]}>
      <Image source={require('../../assets/images/sams_logo.jpeg')} style={styles.itemImage} />
      <View style={styles.itemDetailsContainer}>
        <Text style={styles.itemDescText}>{item.itemName}</Text>
        <Text style={styles.sizeText}>{`${strings('PRINT.SIGN_SIZE')}: ${strings(`PRINT.${item.paperSize}`)}`}</Text>
        <View style={styles.itemBottomRowContainer}>
          <Text style={styles.copiesText}>{`${strings('PRINT.COPIES')}: ${item.signQty}`}</Text>
          <View style={styles.actionBtnContainer}>
            <IconButton
              icon={<MaterialCommunityIcon name="pencil" color={COLOR.GREY_700} size={22} />}
              type={IconButton.Type.NO_BORDER}
              style={styles.actionBtns}
              onPress={handleEditAction(index)}
            />
            <IconButton
              icon={<MaterialCommunityIcon name="delete" color={COLOR.GREY_700} size={22} />}
              type={IconButton.Type.NO_BORDER}
              style={styles.actionBtns}
              onPress={handleDeleteAction(index)}
            />
          </View>
        </View>
      </View>
    </View>
  ));
};

const PrintQueue = () => {
  const { printQueue } = useTypedSelector(state => state.Print);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [itemIndexToEdit, setItemIndexToEdit] = useState(-1);

  const handlePrint = () => {
    console.log('Print all clicked');
  };

  return (printQueue.length === 0
    ? (
      <View style={styles.emptyContainer}>
        <IconButton
          icon={<MaterialCommunityIcon name="printer" color={COLOR.GREY_500} size={100} />}
          type={IconButton.Type.PRIMARY}
          backgroundColor={COLOR.GREY_200}
          height={250}
          width={250}
          radius={250}
          style={styles.emptyImage}
          disabled
        />
        <Text style={styles.emptyText}>{strings('PRINT.EMPTY_LIST')}</Text>
      </View>
    )
    : (
      <SafeAreaView style={styles.safeAreaView}>
        <Modal
          visible={itemIndexToEdit >= 0}
          onRequestClose={() => {
            setItemIndexToEdit(-1);
          }}
          transparent
        >
          <PrintQueueEdit itemIndexToEdit={itemIndexToEdit} setItemIndexToEdit={setItemIndexToEdit} />
        </Modal>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.totalCountContainer}>
            <Text>{`${printQueue.length} ${strings('PRINT.TOTAL_ITEMS')}`}</Text>
          </View>
          <View style={styles.listContainer}>
            {renderPrintItem(printQueue, setItemIndexToEdit, dispatch)}
          </View>
        </ScrollView>
        <View style={styles.footerBtnContainer}>
          <Button
            title={strings('PRINT.PRINT_ALL')}
            type={Button.Type.PRIMARY}
            style={styles.footerBtn}
            onPress={handlePrint}
            disabled={printQueue.length < 1}
          />
        </View>
      </SafeAreaView>
    )
  );
};

export default PrintQueue;
