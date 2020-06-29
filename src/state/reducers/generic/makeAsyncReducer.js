import _ from 'lodash';

const getInitialState = () => ({
  isWaiting: false,
  value: null,
  error: null,
  result: null
});

export function makeAsyncReducer(THIS_ASYNC_OPERATION) {
  const reducer = (state = getInitialState(), action = undefined) => {
    const { type, payload } = action;

    switch (type) {
      case THIS_ASYNC_OPERATION.RESET:
        return getInitialState();
      case THIS_ASYNC_OPERATION.START:
        return {
          ...state,
          isWaiting: true,
          value: payload,
          error: null
        };
      case THIS_ASYNC_OPERATION.FAIL:
        return {
          ...state,
          isWaiting: false,
          error: _.get(payload, 'message') || payload,
          result: null
          // leave value unmodified
        };
      case THIS_ASYNC_OPERATION.SUCCEED:
        return {
          ...state,
          isWaiting: false,
          error: null,
          result: payload
          // leave value unmodified
        };
      case THIS_ASYNC_OPERATION.PAUSE:
        return {
          ...state,
          isWaiting: false
        };
      case THIS_ASYNC_OPERATION.RESUME:
        return {
          ...state,
          isWaiting: true
        };
      default:
        return state;
    }
  };

  return reducer;
}
