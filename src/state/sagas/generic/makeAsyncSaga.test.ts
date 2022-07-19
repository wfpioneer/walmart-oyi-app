import {
  SagaIteratorClone,
  cloneableGenerator
} from '@redux-saga/testing-utils';
import {
  call, put, select, takeLatest
} from 'redux-saga/effects';
import { AxiosError, AxiosResponse } from 'axios';
import { makeAsyncSaga } from './makeAsyncSaga';
import {
  makeAsyncActionCreators,
  makeAsyncActionTypes
} from '../../actions/generic/makeAsyncActions';
import { mockAxiosResponse } from '../../../services/Request';
import { mockConfig } from '../../../mockData/mockConfig';

jest.mock('../../../utils/AppCenterTool.ts', () => ({
  ...jest.requireActual('../../../utils/__mocks__/AppCenterTool.js'),
  trackEvent: jest.fn(() => Promise.resolve())
}));
describe('Testing MakeAsyncSaga', () => {
  const MOCK_SAGA = 'SAGA/MOCK_TEST';
  const MOCK_ACTION_TYPES = makeAsyncActionTypes('API/MOCK_TEST');
  const mockActionCreator = makeAsyncActionCreators(MOCK_ACTION_TYPES);
  const mockService = (
    payload: any,
    options?: Omit<AxiosResponse<any, any>, 'data'>
  ) => mockAxiosResponse(payload, options);
  const handleError = (error: AxiosError) => error.message;
  const saga = makeAsyncSaga(
    MOCK_SAGA,
    mockActionCreator,
    mockService,
    undefined,
    handleError
  );
  const FLUFFY_PAYLOAD = 'FLUFFY_TEST';
  describe('Tests makeAsyncSaga Watcher function*', () => {
    const watcher = saga.watcher();
    it('Checks start actions using takeLatest', () => {
      expect(watcher.next().value).toEqual(takeLatest(MOCK_SAGA, saga.worker));
      expect(watcher.next().done).toBe(true);
    });
  });

  describe('Tests makeAsyncSaga Worker function*', () => {
    // @ts-expect-error expects Worker()* Iterators to match all types in the combined Redux State
    const cloneableWorker = cloneableGenerator(saga.worker);
    const mockSagaAction = (payload: any) => ({ type: MOCK_SAGA, payload });
    const rootWorker = cloneableWorker(mockSagaAction(mockConfig));
    const mockAppCenter = jest.requireMock('../../../utils/AppCenterTool.ts');
    let rootWorkerError: SagaIteratorClone;

    it('Tests Start Action', () => {
      expect(rootWorker.next().value).toEqual(
        // @ts-expect-error 'START' subAction payload is returning as type 'never'
        put(mockActionCreator.START(mockConfig))
      );
      expect(mockAppCenter.trackEvent).toBeCalledWith(
        'API_START',
        expect.any(Object)
      );
    });

    it('MakeAsyncSaga yields service call response', () => {
      expect(rootWorker.next().value).toEqual(call(mockService, mockConfig));
    });

    it('MakeAsyncSaga yields success result', async () => {
      const serviceResponse = await mockService(FLUFFY_PAYLOAD);

      expect(rootWorker.next(serviceResponse).value).toEqual(
        put(mockActionCreator.SUCCEED(serviceResponse))
      );
      expect(mockAppCenter.trackEvent).toBeCalledWith(
        'API_SUCCESS',
        expect.any(Object)
      );
    });
    describe('Tests MakeAsyncSaga worker error flow', () => {
      beforeAll(() => {
        rootWorkerError = rootWorker.clone();
      });
      const mockError: AxiosError = {
        config: {},
        isAxiosError: true,
        message: '500 Network Error',
        name: 'Network Error',
        toJSON: () => Object
      };

      it('MakeAsyncSaga yields error response', () => {
        // @ts-expect-error the error invoked is not undefined
        expect(rootWorkerError.throw(mockError).value).toEqual(
          put(mockActionCreator.FAIL(mockError))
        );
        expect(mockAppCenter.trackEvent).toBeCalledWith(
          'API_FAIL',
          expect.any(Object)
        );
      });

      it('Worker function* calls handleError function', () => {
        expect(rootWorkerError.next().value).toEqual(
          call(handleError, mockError)
        );
      });

      it('Worker function* returns null', () => {
        expect(rootWorkerError.next().value).toBe(select());
      });

      it('Worker function enters finally block', () => {
        expect(rootWorkerError.next().value).toEqual(
          put(mockActionCreator.COMPLETE(undefined))
        );
        expect(rootWorkerError.next().done).toBe(true);
      });
    });
  });
});
