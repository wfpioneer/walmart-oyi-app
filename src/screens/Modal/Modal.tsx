import React from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import COLOR from '../../themes/Color';

const mapStateToProps = (state: any) => ({
  showModal: state.modal.showModal,
  showActivity: state.modal.showActivity
});

interface ActivityModalComponentProps {
  showModal: boolean;
  showActivity: boolean;
}

class ActivityModalComponent extends React.PureComponent<ActivityModalComponentProps> {
  render() {
    return (
      <Modal isVisible={this.props.showModal} useNativeDriver animationInTiming={0}>
        {this.props.showActivity
        && (
        <View style={{
          alignContent: 'center',
          alignSelf: 'center',
          height: 50,
          width: 50,
          backgroundColor: COLOR.WHITE,
          borderRadius: 5,
          justifyContent: 'center'
        }}
        >
          <ActivityIndicator size="large" color={Platform.OS === 'android' ? COLOR.MAIN_THEME_COLOR : undefined} />
        </View>
        )
        }
      </Modal>
    );
  }
}

export default connect(mapStateToProps, null)(ActivityModalComponent);
