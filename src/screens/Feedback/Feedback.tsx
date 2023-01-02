import React, { Dispatch, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TextInput,
  View
} from 'react-native';
import { useDispatch } from 'react-redux';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import COLOR from '../../themes/Color';
import Button, { ButtonType } from '../../components/buttons/Button';
import Stars from '../../components/stars/Stars';
import { strings } from '../../locales';
import styles from './Feedback.style';
import { submitFeedbackRating } from '../../state/actions/saga';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import User from '../../models/User';
import { AsyncState } from '../../models/AsyncState';
import { SNACKBAR_TIMEOUT } from '../../utils/global';
import { SUBMIT_FEEDBACK_RATING } from '../../state/actions/asyncAPI';

export interface FeedbackScreenProps {
  dispatch: Dispatch<any>;
  rate: number;
  setRate: React.Dispatch<React.SetStateAction<number>>;
  feedback: string;
  setFeedBack: React.Dispatch<React.SetStateAction<string>>;
  appUser: User;
  useEffectHook: typeof useEffect;
  feedbackRatingApiStatus: AsyncState;
  navigation: NavigationProp<any>;
}

const handleUnhandledTouches = () => {
  Keyboard.dismiss();
  return false;
};

export const feedbackRatingApiStatusHook = (
  feedbackRatingApiStatus: AsyncState,
  navigation: NavigationProp<any>,
  dispatch: Dispatch<any>
) => {
  if (navigation.isFocused() && !feedbackRatingApiStatus.isWaiting) {
    if (feedbackRatingApiStatus.result) {
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: strings('FEEDBACK.SUBMIT_FEEDBACK_SUCCESS'),
        visibilityTime: SNACKBAR_TIMEOUT
      });
      dispatch({ type: SUBMIT_FEEDBACK_RATING.RESET });
      navigation.goBack();
    }
    if (feedbackRatingApiStatus.error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: strings('FEEDBACK.SUBMIT_FEEDBACK_FAILURE'),
        visibilityTime: SNACKBAR_TIMEOUT
      });
      dispatch({ type: SUBMIT_FEEDBACK_RATING.RESET });
    }
  }
};
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../../../package.json');

export const FeedbackScreen = (props: FeedbackScreenProps): JSX.Element => {
  const {
    dispatch,
    feedback,
    feedbackRatingApiStatus,
    rate,
    setFeedBack,
    setRate,
    appUser,
    useEffectHook,
    navigation
  } = props;

  // Feedback Service Response
  useEffectHook(
    () => feedbackRatingApiStatusHook(
      feedbackRatingApiStatus,
      navigation,
      dispatch
    ),
    [feedbackRatingApiStatus]
  );

  if (feedbackRatingApiStatus.isWaiting) {
    return (
      <ActivityIndicator
        animating={feedbackRatingApiStatus.isWaiting}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }
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
            value={feedback}
            onChangeText={(text: string) => setFeedBack(text)}
            testID="Feedback Input"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title={strings('GENERICS.SUBMIT')}
            type={ButtonType.PRIMARY}
            onPress={() => {
              dispatch(
                submitFeedbackRating({
                  body: feedback,
                  countryCd: appUser.countryCode,
                  score: rate,
                  storeNbr: appUser.siteId,
                  subject: 'OYI App Feedback',
                  userId: appUser.userId,
                  version: pkg.version
                })
              );
            }}
            disabled={rate === 0}
            testID="Submit Feedback"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const Feedback = (): JSX.Element => {
  const [rate, setRate] = useState(0);
  const [feedback, setFeedback] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const appUser = useTypedSelector(state => state.User);
  const feedbackRatingApiStatus = useTypedSelector(
    state => state.async.submitFeedbackRating
  );

  return (
    <FeedbackScreen
      dispatch={dispatch}
      rate={rate}
      setRate={setRate}
      feedback={feedback}
      setFeedBack={setFeedback}
      appUser={appUser}
      useEffectHook={useEffect}
      feedbackRatingApiStatus={feedbackRatingApiStatus}
      navigation={navigation}
    />
  );
};

export default Feedback;
