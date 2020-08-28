import React from 'react';
import {
  ActivityIndicator, Platform, Text, View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import COLOR from '../../themes/Color';
import styles from './Modal.style';

const mapStateToProps = (state: any) => ({
  showModal: state.modal.showModal,
  showActivity: state.modal.showActivity,
  modalContent: state.modal.content
});

interface ActivityModalComponentProps {
  showModal: boolean;
  showActivity: boolean;
  modalContent: any;
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

export default connect(mapStateToProps, null)(ActivityModalComponent);
