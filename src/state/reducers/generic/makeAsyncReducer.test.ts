import { AxiosError, AxiosResponse } from "axios";
import { makeAsyncReducer } from './makeAsyncReducer';
import { makeAsyncActionCreators, makeAsyncActionTypes } from '../../actions/generic/makeAsyncActions';

describe('testing makeAsyncReducer', () => {
  const TEST_ACTIONS = 'API/TEST_ACTIONS';
  const testActionsTypes = makeAsyncActionTypes(TEST_ACTIONS);
  const testActions = makeAsyncActionCreators(testActionsTypes);
  const testReducer = makeAsyncReducer(testActionsTypes);
  const initialState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };

  it('test makeAsyncReducer.START', () => {
    const expectedState = {
      ...initialState,
      isWaiting: true
    };
    // need to ignore ts error here as function has a parameter of never which can not be passed
    // @ts-ignore
    expect(testReducer(initialState, testActions.START(null))).toStrictEqual(expectedState)
  });

  it('test makeAsyncReducer.SUCCEED', () => {
    const expectedResponse: AxiosResponse = {
      config: {},
      headers: {},
      status: 200,
      statusText: 'test',
      data: 'test'
    };
    const expectedState = {
      ...initialState,
      result: expectedResponse
    };
    expect(testReducer(initialState, testActions.SUCCEED(expectedResponse))).toStrictEqual(expectedState)
  });

  it('test makeAsyncReducer.COMPLETE', () => {
    const expectedState = {
      ...initialState
    };
    // complete is in the actions but is not in the switch for the reducer so should return state submitted
    expect(testReducer(initialState, testActions.COMPLETE({}))).toStrictEqual(expectedState)
  });

  it('test makeAsyncReducer.FAIL', () => {
    const expectedError: AxiosError = {
      name: 'testError',
      message: 'testError',
      isAxiosError: true,
      toJSON: jest.fn(),
      config: {}
    };
    const expectedState = {
      ...initialState,
      error: expectedError
    };
    expect(testReducer(initialState, testActions.FAIL(expectedError))).toStrictEqual(expectedState)
  });

  it('test makeAsyncReducer.PAUSE', () => {
    const changedState = {
      ...initialState,
      isWaiting: true
    };
    // need to ignore ts error here as function has a parameter of never which can not be passed
    // @ts-ignore
    expect(testReducer(changedState, testActions.PAUSE())).toStrictEqual(initialState)
  });

  it('test makeAsyncReducer.RESUME', () => {
    const expectedState = {
      ...initialState,
      isWaiting: true
    };
    // need to ignore ts error here as function has a parameter of never which can not be passed
    // @ts-ignore
    expect(testReducer(initialState, testActions.RESUME())).toStrictEqual(expectedState)
  });

  it('test makeAsyncReducer.RESET', () => {
    const expectedResponse: AxiosResponse = {
      config: {},
      headers: {},
      status: 200,
      statusText: 'test',
      data: 'test'
    };
    const changedState = {
      ...initialState,
      result: expectedResponse
    };
    // need to ignore ts error here as function has a parameter of never which can not be passed
    // @ts-ignore
    expect(testReducer(changedState, testActions.RESET())).toStrictEqual(initialState)
  });
});