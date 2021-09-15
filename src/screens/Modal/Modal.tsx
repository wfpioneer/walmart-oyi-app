import React, { ReactElement, ReactNode } from 'react';
import {
  ActivityIndicator, Modal as OrgModal, Platform, Text, TouchableOpacity, View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import COLOR from '../../themes/Color';
import styles from './Modal.style';
import { strings } from '../../locales';
import { hideInfoModal } from '../../state/actions/Modal';

const mapStateToProps = (state: any) => ({
  showModal: state.modal.showModal,
  showActivity: state.modal.showActivity,
  modalContent: state.modal.content
});

const mapDispatchToProps = {
  hideInfoModal
};

interface ActivityModalComponentProps {
  showModal: boolean;
  showActivity: boolean;
  modalContent: any;
  hideInfoModal: Function;
}

class ActivityModalComponent extends React.PureComponent<ActivityModalComponentProps> {
  renderActivityIndicator() {
    if (!this.props.showActivity) {
      return null;
    }
    return (
      <View style={styles.activityView}>
        <ActivityIndicator size="large" color={Platform.OS === 'android' ? COLOR.MAIN_THEME_COLOR : undefined} />
      </View>
    );
  }

  renderContentView() {
    if (!this.props.modalContent) {
      return null;
    }

    return (
      <View style={styles.infoView}>
        <MaterialIcons name="info" size={30} color={COLOR.MAIN_THEME_COLOR} style={styles.normalText} />
        <Text style={styles.titleText}>{this.props.modalContent.title}</Text>
        <Text style={styles.normalText}>{this.props.modalContent.text}</Text>
        <TouchableOpacity style={styles.okButton} onPress={() => this.props.hideInfoModal()}>
          <Text style={styles.okText}>{strings('GENERICS.OK')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <Modal isVisible={this.props.showModal} useNativeDriver animationInTiming={0}>
        { this.renderActivityIndicator() }
        { this.renderContentView() }
      </Modal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityModalComponent);

interface CustomModalProps {
  children: ReactNode | ReactElement;
  modalType: 'Error' | 'Form' | 'Info'| 'Spinner';
  isVisible: boolean
  onClose: () => void;
}
const stylePicker = {
  Error: styles.errorContainer,
  Form: styles.contentContainer,
  Info: styles.infoView,
  Spinner: styles.activityView
};

export const CustomModal = (props: CustomModalProps): JSX.Element => {
  const {
    children, isVisible, modalType, onClose
  } = props;

  return (
    <OrgModal
      onRequestClose={() => onClose()}
      visible={isVisible}
      transparent={true}
    >
      {modalType === 'Spinner'
        ? (
          <View style={styles.activityView}>
            <ActivityIndicator size="large" color={Platform.OS === 'android' ? COLOR.MAIN_THEME_COLOR : undefined} />
          </View>
        )
        : (
          <View style={styles.modalContainer}>
            <View style={stylePicker[modalType]}>

              {children}
            </View>
          </View>
        )}
    </OrgModal>
  );
};
