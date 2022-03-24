import { Reducer } from 'redux';
import { AxiosError } from 'axios';
import { SubactionsMap } from '../../actions/generic/makeAsyncActions';
import { PartialState } from '../RootReducer';

const getInitialState = <Q, R, E = string>(): AsyncState<Q, R, E> => ({
  isWaiting: false,
  value: null,
  error: null,
  result: null
});

export interface AsyncState<Q, R, E = AxiosError> {
  isWaiting: boolean;
  value: Q | null;
  error: E | null;
  result: R | null;
}

export interface AsyncAction<Q, R, E = AxiosError> {
  type: string;
  payload?: Q | R | E | AsyncState<Q, R, E> | PartialState;
}

export type AsyncReducer<Q, R, E> = Reducer<AsyncState<Q, R, E>, any>;

export function makeAsyncReducer<Q, R, E = AxiosError>(
  sagaSubaction: { [key in keyof SubactionsMap]: string }
): AsyncReducer<Q, R, E> {
  const reducer = (
    state: AsyncState<Q, R, E> = getInitialState<Q, R, E>(),
    action: AsyncAction<Q, R, E>
  ): AsyncState<Q, R, E> => {
    const { type, payload } = action;

    switch (type) {
      case sagaSubaction.RESET:
        return getInitialState<Q, R, E>();
      case sagaSubaction.START:
        return {
          ...state,
          isWaiting: true,
          value: payload as Q,
          error: null
        };
      case sagaSubaction.FAIL:
        return {
          ...state,
          isWaiting: false,
          error: payload as E,
          result: null
          // leave value unmodified
        };
      case sagaSubaction.SUCCEED:
        return {
          ...state,
          isWaiting: false,
          error: null,
          result: payload as R
          // leave value unmodified
        };
      case sagaSubaction.PAUSE:
        return {
          ...state,
          isWaiting: false
        };
      case sagaSubaction.RESUME:
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
