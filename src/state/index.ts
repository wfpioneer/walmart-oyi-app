import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import RootReducer from './reducers/RootReducer';
import rootSaga from './sagas';

function makeStore() {
  const sagaMiddleware = createSagaMiddleware();

  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const middlewares = [sagaMiddleware];

  if (__DEV__) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const createDebugger = require('redux-flipper').default;
    middlewares.push(createDebugger());
  }

  const store = createStore(RootReducer,
    composeEnhancer(applyMiddleware(...middlewares)));

  sagaMiddleware.run(rootSaga);
  return store;
}

const store = makeStore();
export default store;
