import React, { Dispatch, useState } from 'react';
import {
  Keyboard, KeyboardAvoidingView, Text, TextInput, View
} from 'react-native';
import { useDispatch } from 'react-redux';
import COLOR from '../../themes/Color';
import Button, { ButtonType } from '../../components/buttons/Button';
import Stars from '../../components/stars/Stars';
import { strings } from '../../locales';
import styles from './Feedback.style';

export interface FeedbackScreenProps {
  dispatch: Dispatch<any>;
  rate: number;
  setRate: React.Dispatch<React.SetStateAction<number>>;
}

const handleUnhandledTouches = () => {
  Keyboard.dismiss();
  return false;
};

export const FeedbackScreen = (props: FeedbackScreenProps): JSX.Element => {
  const { rate, setRate, dispatch } = props;
  return (
    <KeyboardAvoidingView
      style={styles.safeAreaView}
      behavior="height"
      keyboardVerticalOffset={110}
      onStartShouldSetResponder={handleUnhandledTouches}
    >
      <View style={styles.container}>
        <View style={styles.rateContainer}>
          <Text>{strings('FEEDBACK.RATING_LABEL')}</Text>
          <Stars initialValue={rate} onValueChange={val => setRate(val)} />
        </View>
        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            placeholder={strings('FEEDBACK.COMMENT_PLACEHOLDER_LABEL')}
            placeholderTextColor={COLOR.GREY}
            numberOfLines={10}
            multiline={true}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title={strings('GENERICS.SUBMIT')}
            type={ButtonType.PRIMARY}
          // dispatch action needs to be called when clicking submit
            onPress={() => {}}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const Feedback = (): JSX.Element => {
  const [rate, setRate] = useState(0);
  const dispatch = useDispatch();
  return (
    <FeedbackScreen
      dispatch={dispatch}
      rate={rate}
      setRate={setRate}
    />
  );
};

export default Feedback;
