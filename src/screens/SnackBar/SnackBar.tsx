import React from 'react';
import { Snackbar } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState, useTypedSelector } from '../../state/reducers/RootReducer';
import { hideSnackBar } from '../../state/actions/SnackBar';
import styles from './SnackBar.style';

interface SnackBarProps {
  showSnackBar: boolean;
  dispatch: Dispatch<any>
  messageContent: string;
  duration: number;
}

export const SnackBarComponent = (props: SnackBarProps): JSX.Element => {
  const {
    showSnackBar, dispatch, messageContent, duration
  } = props;

  return (
    <Snackbar
      visible={showSnackBar}
      onDismiss={() => dispatch(hideSnackBar())}
      duration={duration}
      style={styles.snackView}
    >
      {messageContent}
    </Snackbar>
  );
};

export const SnackBar = (): JSX.Element => {
  const { showSnackBar, messageContent, duration } = useTypedSelector(state => state.SnackBar);
  const dispatch = useDispatch();
  return (
    <SnackBarComponent
      showSnackBar={showSnackBar}
      dispatch={dispatch}
      duration={duration}
      messageContent={messageContent}
    />
  );
};
