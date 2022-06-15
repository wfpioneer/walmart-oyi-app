import { runSaga } from 'redux-saga'
import { fork, put, take, takeLatest } from 'redux-saga/effects';
import { makeAsyncSaga } from './makeAsyncSaga';
import { makeAsyncActionCreators, makeAsyncActionTypes } from '../../actions/generic/makeAsyncActions';
import HitGoogleService from '../../../services/HitGoogle.service';
import {AxiosResponse} from "axios";

describe('testing makeAsyncSaga', () => {
  const expectedResponse: AxiosResponse = {
    config: {},
    headers: {},
    status: 200,
    statusText: 'test',
    data: 'test'
  };
  it('test makeAsyncSaga', async () => {
    const TEST_ACTIONS = 'API/TEST_ACTIONS';
    const TEST_SAGA = 'SAGA/TEST_ACTIONS';
    const testActionsTypes = makeAsyncActionTypes(TEST_ACTIONS);
    const testActions = makeAsyncActionCreators(testActionsTypes);
    const mockService = jest.fn().mockImplementation(() => Promise.resolve(expectedResponse));
    const testSagaGen = makeAsyncSaga(TEST_SAGA, testActions, mockService);
    console.log(testSagaGen);
    const testSaga = testSagaGen();
    console.log(testSaga.next().value);
    console.log(fork(testSagaGen));
    console.log(testSaga.next());
    console.log(testSaga.return());
    expect(testSaga).toStrictEqual(0);
  });
});