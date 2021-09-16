import React, { ReactElement, ReactNode } from 'react';
import {
  ActivityIndicator, Modal, Platform, Text, TouchableOpacity, View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import COLOR from '../../themes/Color';
import styles from './Modal.style';
import { strings } from '../../locales';
import { hideInfoModal } from '../../state/actions/Modal';
import { useTypedSelector } from '../../state/reducers/RootReducer';

interface CustomModalProps {
  children: ReactNode | ReactElement;
  modalType: 'Error' | 'Form' | 'Popup';
  isVisible: boolean
  onClose: () => void;
}

export const CustomModal = (props: CustomModalProps): JSX.Element => {
  const {
    children, isVisible, modalType, onClose
  } = props;

  const styleSelector = {
    Error: styles.errorContainer,
    Form: styles.contentContainer,
    Popup: styles.popUpContainer
  };

  return (
    <Modal
      onRequestClose={() => onClose()}
      visible={isVisible}
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styleSelector[modalType]}>
          {children}
        </View>
      </View>
    </Modal>
  );
};

// TODO Brainstorm a way to remove the need for dispatching calls to the global modal
export const ActivityModalComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  const { showActivity, showModal, content: modalContent } = useTypedSelector(state => state.modal);
  const renderActivityIndicator = () => (
    <View style={styles.activityView}>
      <ActivityIndicator size="large" color={Platform.OS === 'android' ? COLOR.MAIN_THEME_COLOR : undefined} />
    </View>
  );

  const renderContentView = () => (
    <View style={styles.infoView}>
      <MaterialIcons name="info" size={30} color={COLOR.MAIN_THEME_COLOR} style={styles.normalText} />
      <Text style={styles.titleText}>{modalContent.title}</Text>
      <Text style={styles.normalText}>{modalContent.text}</Text>
      <TouchableOpacity style={styles.okButton} onPress={() => dispatch(hideInfoModal())}>
        <Text style={styles.okText}>{strings('GENERICS.OK')}</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <Modal visible={showModal} transparent>
      <View style={styles.modalContainer}>
        { showActivity && renderActivityIndicator() }
        { modalContent && renderContentView() }
      </View>
    </Modal>
  );
};
