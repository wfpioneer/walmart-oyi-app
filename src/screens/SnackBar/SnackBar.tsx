import React from 'react';
import { Snackbar } from 'react-native-paper';
import { connect } from 'react-redux';
import { RootState } from '../../state/reducers/RootReducer';
import { hideSnackBar } from '../../state/actions/SnackBar';
import styles from './SnackBar.style';

interface SnackBarProps {
  showSnackBar: boolean;
  hideSnackBar: () => void;
  messageContent: string;
  duration: number;
}

const mapStateToProps = (state: RootState) => ({
  showSnackBar: state.SnackBar.showSnackBar,
  messageContent: state.SnackBar.messageContent,
  duration: state.SnackBar.duration
});

const mapDispatchToProps = {
  hideSnackBar
};
// TODO refactor this for more customizable styling
class SnackBarComponent extends React.PureComponent<SnackBarProps> {
  // TODO look into using SafeAreaInsets to dynamically render SnackBar above bottomTabBar
  render() {
    return (
      <Snackbar
        visible={this.props.showSnackBar}
        onDismiss={() => this.props.hideSnackBar()}
        duration={this.props.duration}
        style={styles.snackView}
      >
        {this.props.messageContent}
      </Snackbar>
    );
  }
}

export const SnackBar = connect(mapStateToProps, mapDispatchToProps)(SnackBarComponent);
