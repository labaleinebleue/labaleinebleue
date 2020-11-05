import _ from 'lodash';

export const omitEmptyValues = (object) =>
  _.pickBy(object, (value) => !_.isEmpty(value));

export const rejectEmptyValues = (array) =>
  _.filter(array, (value) => !_.isEmpty(value));
