import React from 'react';
import { Image, Modal, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import styles from './PrintQueue.styles';
import { PrintQueueItem } from '../../models/Printer';
import IconButton from '../../components/buttons/IconButton';
import Button from '../../components/buttons/Button';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLOR from '../../themes/Color';

const renderPrintItem = (printQueue: PrintQueueItem[]) => {

  return printQueue.map((item, index) => {
    return (
      <View key={index} style={[styles.itemContainer, index < printQueue.length - 1 ? styles.itemContainerBorder : {} ]}>
        <Image source={require('../../assets/images/sams_logo.jpeg')} style={styles.itemImage} />
        <View style={styles.itemDetailsContainer}>
          <Text style={styles.itemDescText}>{item.itemName}</Text>
          <Text style={styles.sizeText}>{`Paper size: ${item.paperSize}`}</Text>
          <View style={styles.itemBottomRowContainer}>
            <Text style={styles.copiesText}>{`Copies: ${item.signQty}`}</Text>
            <View style={styles.actionBtnContainer} >
              <IconButton
                icon={<MaterialCommunityIcon name={'pencil'} color={COLOR.GREY_700} size={22} />}
                type={IconButton.Type.NO_BORDER}
                style={styles.actionBtns}
                onPress={() => console.log('edit clicked')}
              />
              <IconButton
                icon={<MaterialCommunityIcon name={'delete'} color={COLOR.GREY_700} size={22} />}
                type={IconButton.Type.NO_BORDER}
                style={styles.actionBtns}
                onPress={() => console.log('delete clicked')}
              />
            </View>
          </View>
        </View>
      </View>
    )
  })
}

const PrintQueue = () => {
  const { printQueue } = useTypedSelector(state => state.Print);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handlePrint = () => {
    console.log('Print all clicked');
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Modal
        visible={false}
        onRequestClose={() => {}}
        transparent
      >
      </Modal>
      <ScrollView contentContainerStyle={styles.container} >
        <View style={styles.totalCountContainer}>
          <Text>{`${printQueue.length} items total`}</Text>
        </View>
        <View style={styles.listContainer}>
          {renderPrintItem(printQueue)}
        </View>
      </ScrollView>
      <View style={styles.footerBtnContainer}>
        <Button
          title={'Print all'}
          type={Button.Type.PRIMARY}
          style={styles.footerBtn}
          onPress={handlePrint}
          disabled={printQueue.length < 1}
        />
      </View>
    </SafeAreaView>
  )
}

export default PrintQueue;
