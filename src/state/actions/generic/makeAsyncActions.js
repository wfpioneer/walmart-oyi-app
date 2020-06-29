import _ from 'lodash';

export const subactionTypeNames = [
  'START',
  'FAIL',
  'SUCCEED',
  'RESET',
  'PAUSE',
  'RESUME'
];

export const SUBACTIONS = _.mapKeys(subactionTypeNames);

export function makeAsyncActionTypes(base) {
  return _.mapValues(SUBACTIONS, subaction => `${base}/${subaction}`);
}

export const createGenericTag = (actionTypeSet, subtypeKey) => {
  const splitAction = _.split(_.toLower(actionTypeSet[subtypeKey]), '/');
  const action = _.replace(_.nth(splitAction, -2), /get_/, '');

  return `req_${action}_${_.toLower(subtypeKey)}`;
};

export function makeAsyncActionCreators(actionTypeSet) {
  function actionCreatorForSubtype(subtypeKey) {
    // Generate the tag here so that all request action tags can be created at boot time, instead of
    // recreating the tag every time one of these actions is dispatched.
    const tag = createGenericTag(actionTypeSet, subtypeKey);

    return payload => ({
      tag,
      payload,
      type: actionTypeSet[subtypeKey]
    });
  }

  return _.chain(SUBACTIONS)
    .mapKeys(_.camelCase)
    .mapValues(actionCreatorForSubtype)
    .value();
}
