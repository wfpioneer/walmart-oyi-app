import {
  mapKeys, mapValues, nth, replace, split, toLower
} from 'lodash';
import { AxiosError, AxiosResponse } from 'axios';
import { AsyncState } from '../../reducers/generic/makeAsyncReducer';
import { PartialState } from '../../reducers/RootReducer';

export const subactionTypeNames = [
  'START',
  'FAIL',
  'SUCCEED',
  'RESET',
  'PAUSE',
  'RESUME',
  'COMPLETE'
] as const;

export const SUBACTIONS: SubactionsMap = mapKeys(
  subactionTypeNames
) as SubactionsMap;

export type SubactionsMap = { [key in typeof subactionTypeNames[number]]: key };

/**
 * The return type of this function would be more accurate with mapped string literal types.
 * It would look more like `{ [key in keyof SubactionsMap]: \`${typeof base}/${typeof subaction}\`}`
 *
 * @param base
 */
export function makeAsyncActionTypes(base: string): {
  [key in keyof SubactionsMap]: string;
} {
  return mapValues(SUBACTIONS, subaction => `${base}/${subaction}`);
}

export const createGenericTag = (
  actionTypeSet: { [key: string]: string },
  subtypeKey: string
) => {
  const splitAction = split(toLower(actionTypeSet[subtypeKey]), '/');
  const action = replace(nth(splitAction, -2)!, /get_/, '');

  return `req_${action}_${toLower(subtypeKey)}`;
};

export function makeAsyncActionCreators<
  RequestPayload = never,
  ResponsePayload = AxiosResponse,
  ErrorPayload = AxiosError
>(actionTypeSet: {
  [key in keyof SubactionsMap]: string;
}): GenericActionTypes<RequestPayload, ResponsePayload, ErrorPayload> {
  function actionCreatorForSubtype(subtypeKey: keyof SubactionsMap) {
    // Generate the tag here so that all request action tags can be created at boot time, instead of
    // recreating the tag every time one of these actions is dispatched.
    const tag = createGenericTag(actionTypeSet, subtypeKey);

    // To please the typesystem without specifying every possible ActionCreator type, we just use any.
    return (payload: any) => ({
      tag,
      payload,
      type: actionTypeSet[subtypeKey]
    } as any);
  }

  return mapValues(SUBACTIONS, actionCreatorForSubtype);
}

/**
 * Because mapped literal types aren't possible, tag and type must be `string` else they
 * could possibly be typed to be the exact string they represent. So for instance, the return type
 * of this might look like
 * ```ts
 * {
 *   START: (payload: RequestPayload) => {tag: 'req_hit_google_start', type: 'API/HIT_GOOGLE/START', payload: RequestPayload}
 *   FAIL: (payload: ErrorPayload) => {tag: 'req_hit_google_fail', type: 'API/HIT_GOOGLE/FAIL', payload: ErrorPayload, payload: ErrorPayload}
 *   SUCCEED: (payload: ResponsePayload) => {tag: 'req_hit_google_succeed', type: 'API/HIT_GOOGLE/SUCCEED', payload: ResponsePayload},
 *   // ... etc no payload actions
 * }
 * ```
 * Which would improve the intellisense of the reducer as well
 * https://github.com/microsoft/TypeScript/issues/12754#issuecomment-351066369
 * */
export type GenericActionTypes<
  RequestPayload,
  ResponsePayload = AxiosResponse,
  ErrorPayload = AxiosError
> = {
  [ActionKey in keyof SubactionsMap]: (
    payload: PayloadDiscriminant<
      ActionKey,
      RequestPayload,
      ResponsePayload,
      ErrorPayload
    >
  ) => {
    tag: string;
    type: string;
    payload: PayloadDiscriminant<
      ActionKey,
      RequestPayload,
      ResponsePayload,
      ErrorPayload
    >;
  };
};

/**
 * This looks like magic, but is reasonably simple. It allows for the Generic Action to return a
 * different type given a String Literal as Key. This helps easily map out the ActionCreators object
 */
type PayloadDiscriminant<Key, RequestPayload, ResponsePayload, ErrorPayload> =
  Key extends 'START'
    ? RequestPayload
    : Key extends 'SUCCEED'
    ? ResponsePayload
    : Key extends 'FAIL'
    ? ErrorPayload
    : Key extends 'COMPLETE'
    ? AsyncState<RequestPayload, ResponsePayload, ErrorPayload> | PartialState
    : never;

export type SagaSubAction<Action, Payload> = {
  readonly type: Action;
  readonly payload: Payload;
};
