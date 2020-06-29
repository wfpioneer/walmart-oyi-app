import React from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import COLOR from '../../themes/Color';

const mapStateToProps = (state: any) => ({
  showActivityModal: state.activityModal
});

interface ActivityModalComponentProps {
  showActivityModal: boolean;
}

class ActivityModalComponent extends React.PureComponent<ActivityModalComponentProps> {
  render() {
    return (
      <Modal isVisible={this.props.showActivityModal} useNativeDriver animationInTiming={0}>
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
      </Modal>
    );
  }
}

export default connect(mapStateToProps, null)(ActivityModalComponent);
