import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import RootReducer from './reducers/RootReducer';
import rootSaga from './sagas';

function makeStore() {
  const sagaMiddleware = createSagaMiddleware();

  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(RootReducer,
    composeEnhancer(applyMiddleware(sagaMiddleware)));

  sagaMiddleware.run(rootSaga);
  return store;
}

export default makeStore();
