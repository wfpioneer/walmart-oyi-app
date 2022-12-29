import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import Toast from 'react-native-toast-message';
import ShallowRenderer from 'react-test-renderer/shallow';
import { fireEvent, render } from '@testing-library/react-native';
import { strings } from '../../locales';
import mockUser from '../../mockData/mockUser';
import { AsyncState } from '../../models/AsyncState';
import { SUBMIT_FEEDBACK_RATING } from '../../state/actions/asyncAPI';
import { SNACKBAR_TIMEOUT } from '../../utils/global';
import { FeedbackRatingApiStatusHook, FeedbackScreen } from './Feedback';
import { submitFeedbackRating } from '../../state/actions/saga';

jest.mock('../../../package.json', () => ({
  version: '1.1.0'
}));
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(() => true),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  navigate: jest.fn(),
  getId: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn()
};
describe('Feedback Screen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const mockRate = 3;
  const mockSetRate = jest.fn();
  const mockDispatch = jest.fn();
  const mockFeedback = '';
  const mockSetFeedback = jest.fn();
  const defaultAsyncApi: AsyncState = {
    error: null,
    isWaiting: false,
    result: null,
    value: null
  };

  it('should render the screen based on props', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <FeedbackScreen
        rate={mockRate}
        setRate={mockSetRate}
        dispatch={mockDispatch}
        feedback={mockFeedback}
        setFeedBack={mockSetFeedback}
        navigation={navigationProp}
        appUser={mockUser}
        FeedbackRatingApiStatus={defaultAsyncApi}
        useEffectHook={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('renders the loading screen when FeedBackRatingApiStatus is called', () => {
    const renderer = ShallowRenderer.createRenderer();
    const feedbackApiIsWaiting: AsyncState = {
      ...defaultAsyncApi,
      isWaiting: true
    };

    renderer.render(
      <FeedbackScreen
        rate={mockRate}
        setRate={mockSetRate}
        dispatch={mockDispatch}
        feedback={mockFeedback}
        setFeedBack={mockSetFeedback}
        navigation={navigationProp}
        appUser={mockUser}
        FeedbackRatingApiStatus={feedbackApiIsWaiting}
        useEffectHook={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Tests FeedbackRatingApiStatusHook on success', () => {
    const feedbackApiSuccess: AsyncState = {
      ...defaultAsyncApi,
      result: {
        status: 201,
        data: {
          id: '03a63319-d964-4dcd-b8ea-44ce911921ec',
          productId: 'a63ee07d-93e6-41ca-807e-050481497dc3',
          score: 4,
          countryCd: 'MX',
          storeNbr: 5522,
          userId: 'Test User',
          body: 'Test Feedback Call',
          timestamp: 1672259522067,
          version: '4.8.2'
        }
      }
    };
    FeedbackRatingApiStatusHook(
      feedbackApiSuccess,
      navigationProp,
      mockDispatch
    );
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'success',
      position: 'bottom',
      text1: strings('FEEDBACK.SUBMIT_FEEDBACK_SUCCESS'),
      visibilityTime: SNACKBAR_TIMEOUT
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: SUBMIT_FEEDBACK_RATING.RESET
    });
    expect(navigationProp.goBack).toHaveBeenCalledTimes(1);
  });

  it('Tests FeedbackRatingApiStatusHook on failure', () => {
    const feedbackApiError: AsyncState = {
      ...defaultAsyncApi,
      error: 'Network Error'
    };
    FeedbackRatingApiStatusHook(feedbackApiError, navigationProp, mockDispatch);
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      position: 'bottom',
      text1: strings('FEEDBACK.SUBMIT_FEEDBACK_FAILURE'),
      visibilityTime: SNACKBAR_TIMEOUT
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: SUBMIT_FEEDBACK_RATING.RESET
    });
  });

  it('Tests User Text Input', () => {
    const text = 'Too Much Water';
    const { getByTestId } = render(
      <FeedbackScreen
        rate={mockRate}
        setRate={mockSetRate}
        dispatch={mockDispatch}
        feedback={mockFeedback}
        setFeedBack={mockSetFeedback}
        navigation={navigationProp}
        appUser={mockUser}
        FeedbackRatingApiStatus={defaultAsyncApi}
        useEffectHook={jest.fn()}
      />
    );

    const feedbackTextInput = getByTestId('Feedback Input');
    fireEvent.changeText(feedbackTextInput, text);
    expect(mockSetFeedback).toHaveBeenCalledWith(text);
  });

  it('Tests Submit FeedBack button', () => {
    const { getByTestId } = render(
      <FeedbackScreen
        rate={mockRate}
        setRate={mockSetRate}
        dispatch={mockDispatch}
        feedback={mockFeedback}
        setFeedBack={mockSetFeedback}
        navigation={navigationProp}
        appUser={mockUser}
        FeedbackRatingApiStatus={defaultAsyncApi}
        useEffectHook={jest.fn()}
      />
    );

    const submitButton = getByTestId('Submit Feedback');
    fireEvent.press(submitButton);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(
      submitFeedbackRating({
        body: mockFeedback,
        countryCd: mockUser.countryCode,
        score: mockRate,
        storeNbr: mockUser.siteId,
        subject: 'OYI App Feedback',
        userId: mockUser.userId,
        version: '1.1.0'
      })
    );
  });
});
