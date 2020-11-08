import _ from 'lodash';

export const omitEmptyValues = (object) =>
  _.pickBy(object, (value) => !_.isEmpty(value));

export const rejectEmptyValues = (array) =>
  _.filter(array, (value) => !_.isEmpty(value));

// e.g.: keyByValueOf(
//         [{ "one": "abc", "foo": "bar" }, { "one": "def", "bar": "baz" }, …],
//         "one"
//       )
//     ⇒ { "abc": { "one": "abc", "foo": "bar"}, "def": { "one": "def", "bar": "baz" }, … }
export const keyByValueOf = (objects, keyName) =>
  _.transform(
    objects,
    (result, object) => {
      result[object[keyName]] = object;
    },
    {}
  );
