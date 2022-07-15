import { cloneableGenerator } from '@redux-saga/testing-utils';
import {
  call, put, select, takeLatest
} from 'redux-saga/effects';
import { makeAsyncSaga } from './makeAsyncSaga';
import {
  makeAsyncActionCreators,
  makeAsyncActionTypes
} from '../../actions/generic/makeAsyncActions';
import { mockAxiosResponse } from '../../../services/Request';

jest.mock('../../../utils/AppCenterTool.ts', () => ({
  ...jest.requireActual('../../../utils/__mocks__/AppCenterTool.js'),
  trackEvent: jest.fn(() => Promise.resolve())
}));
describe('Testing MakeAsyncSaga', () => {
  const MOCK_SAGA = 'SAGA/MOCK_TEST';
  const MOCK_ACTION_TYPES = makeAsyncActionTypes('API/MOCK_TEST');
  const mockActionCreator = makeAsyncActionCreators(MOCK_ACTION_TYPES);
  const mockService = (payload: any) => mockAxiosResponse(payload, {
    config: {},
    status: 200,
    headers: {},
    statusText: 'OK',
    request: {}
  });
  const saga = makeAsyncSaga(MOCK_SAGA, mockActionCreator, mockService);
  describe('Tests makeAsyncSaga Watcher function*', () => {
    const watcher = saga.watcher();
    it('Checks start actions using takeLatest', () => {
      // console.log(watcher.next());
      expect(watcher.next().value).toEqual(takeLatest(MOCK_SAGA, saga.worker));
      expect(watcher.next().done).toBe(true);
    });
  });

  describe('Tests makeAsyncSaga Worker function*', () => {
    const gen = cloneableGenerator(saga.worker);
    const mockSagaAction = (payload: any) => ({ type: MOCK_SAGA, payload });
    const rootWorker = gen(mockSagaAction('TEST'));
    const mockAppCenter = jest.requireMock('../../../utils/AppCenterTool.ts');

    it('Tests Start Action', () => {
      expect(rootWorker.next().value).toEqual(
        put(mockActionCreator.START('TEST'))
      );
      expect(mockAppCenter.trackEvent).toBeCalledWith(
        'API_START',
        expect.any(Object)
      );
    });

    it('MakeAsyncSaga yields service call response', () => {
      expect(rootWorker.next().value).toEqual(
        call(mockService, 'TEST')
      );
    });
  });
});
