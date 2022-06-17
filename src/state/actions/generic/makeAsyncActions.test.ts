import { AxiosError, AxiosResponse } from 'axios';
import { createGenericTag, makeAsyncActionCreators, makeAsyncActionTypes } from './makeAsyncActions';

const TEST_CREATOR = 'API/TEST_CREATOR';

describe('testing makeActionCreators', () => {
  it('test makeActionCreators', () => {
    const test_actions = makeAsyncActionTypes(TEST_CREATOR);
    expect(test_actions.START).toStrictEqual('API/TEST_CREATOR/START');
    expect(test_actions.FAIL).toStrictEqual('API/TEST_CREATOR/FAIL');
    expect(test_actions.SUCCEED).toStrictEqual('API/TEST_CREATOR/SUCCEED');
    expect(test_actions.RESET).toStrictEqual('API/TEST_CREATOR/RESET');
    expect(test_actions.PAUSE).toStrictEqual('API/TEST_CREATOR/PAUSE');
    expect(test_actions.RESUME).toStrictEqual('API/TEST_CREATOR/RESUME');
    expect(test_actions.COMPLETE).toStrictEqual('API/TEST_CREATOR/COMPLETE');
    const results = makeAsyncActionCreators(test_actions);
    // need to ignore ts error here as function has a parameter of never which can not be passed
    // @ts-ignore
    expect(results.START()).toStrictEqual({
      tag: createGenericTag(test_actions, 'START'),
      type: test_actions.START,
      payload: undefined
    });
    const expectedError: AxiosError = {
      name: 'testError',
      message: 'testError',
      isAxiosError: true,
      toJSON: jest.fn(),
      config: {}
    };
    expect(results.FAIL(expectedError)).toStrictEqual({
      tag: createGenericTag(test_actions, 'FAIL'),
      type: test_actions.FAIL,
      payload: expectedError
    });
    const expectedRsponse: AxiosResponse = {
      config: {},
      headers: {},
      status: 200,
      statusText: 'test',
      data: 'test'
    };
    expect(results.SUCCEED(expectedRsponse)).toStrictEqual({
      tag: createGenericTag(test_actions, 'SUCCEED'),
      type: test_actions.SUCCEED,
      payload: expectedRsponse
    });
    // need to ignore ts error here as function has a parameter of never which can not be passed
    // @ts-ignore
    expect(results.RESET()).toStrictEqual({
      tag: createGenericTag(test_actions, 'RESET'),
      type: test_actions.RESET,
      payload: undefined
    });
    // need to ignore ts error here as function has a parameter of never which can not be passed
    // @ts-ignore
    expect(results.PAUSE()).toStrictEqual({
      tag: createGenericTag(test_actions, 'PAUSE'),
      type: test_actions.PAUSE,
      payload: undefined
    });
    // need to ignore ts error here as function has a parameter of never which can not be passed
    // @ts-ignore
    expect(results.RESUME()).toStrictEqual({
      tag: createGenericTag(test_actions, 'RESUME'),
      type: test_actions.RESUME,
      payload: undefined
    });
    expect(results.COMPLETE({})).toStrictEqual({
      tag: createGenericTag(test_actions, 'COMPLETE'),
      type: test_actions.COMPLETE,
      payload: {}
    });
  });
});
