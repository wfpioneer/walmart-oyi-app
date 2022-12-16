import React, { Dispatch, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useDispatch } from 'react-redux';
import Button, { ButtonType } from '../../components/buttons/Button';
import Stars from '../../components/stars/Stars';
import { strings } from '../../locales';
import styles from './Feedback.style';

export interface FeedbackScreenProps {
  dispatch: Dispatch<any>;
  rate: number;
  setRate: React.Dispatch<React.SetStateAction<number>>;
}

const FeedbackScreen = (props: FeedbackScreenProps): JSX.Element => {
  const { rate, setRate, dispatch } = props;
  return (
    <View style={styles.container}>
      <View>
        <Text>{strings('FEEDBACK.RATING_LABEL')}</Text>
      </View>
      <Stars initialValue={rate} onValueChange={val => setRate(val)} />
      <View style={styles.textAreaContainer}>
        <TextInput
          style={styles.textArea}
          underlineColorAndroid="transparent"
          placeholder="Type something"
          placeholderTextColor="grey"
          numberOfLines={10}
          multiline={true}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={strings('GENERICS.SUBMIT')}
          style={styles.submitButton}
          type={ButtonType.PRIMARY}
          // dispatch action needs to be called when clicking submit
          onPress={() => {}}
        />
      </View>
    </View>
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
