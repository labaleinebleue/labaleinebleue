import _ from 'lodash';

export const omitEmptyValues = (object) =>
  _.pickBy(object, (value) => !_.isEmpty(value));
