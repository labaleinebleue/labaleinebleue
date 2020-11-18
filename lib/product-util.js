import _ from 'lodash';

export const withImagesFirst = (product) =>
  _.isEmpty(product.images) ? 1 : -1;
