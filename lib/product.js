import slugify from '@sindresorhus/slugify';
import _ from 'lodash';
import objectMapper from 'object-mapper';
import { convertCodeToId } from './id';
import { fetchCategories } from './category';
import { fetchInventoryRows } from './inventory';
import { fetchVendors } from './vendor';
import { rejectEmptyValues } from './util';

const expectedProductColumnHeaders = [
  'Code Produit',
  'Libellé Caisse',
  'Code Famille',
  'Code Fournisseur',
  'Publiable',
  'Libellé',
  'Image 1',
  'Image 2',
];

const defaultProductRowFilter = (row) =>
  row['Publiable'] === 'Oui' &&
  !_.isEmpty(row['Code Produit']) &&
  !_.isEmpty(row['Code Famille']) &&
  !_.isEmpty(row['Code Fournisseur']) &&
  (!_.isEmpty(row['Libellé Caisse']) || !_.isEmpty(row['Libellé']));

const fetchProductRows = async (productRowFilter = defaultProductRowFilter) =>
  fetchInventoryRows('Articles', expectedProductColumnHeaders, {
    filter: productRowFilter,
  });

const convertProductRowToProduct = (productRow) => {
  // Directly map most product row property values to product properties
  // `id` is a 10 digits digest of `code`
  const product = objectMapper(productRow, {
    'Code Produit': [['code'], ['id', convertCodeToId]],
    'Libellé Caisse': ['shortName'],
    'Code Famille': 'categoryCode',
    'Code Fournisseur': 'vendorCode',
    'Image 1': 'imageHrefs[]+',
    'Image 2': 'imageHrefs[]+',
  });

  // if no mapping property is found,
  // then `name` defaults to a sanitized version of `shortName`
  if (!_.isEmpty(productRow['Libellé'])) {
    product.name = productRow['Libellé'];
  } else {
    let sanitizedShortName = product.shortName;
    // Heuristic: if the first letters of `shortName`’s last word
    // match `vendorCode`, then it probably is a redundant use of
    // vendor code, which we want removed as part of sanitization
    if (_.last(_.words(product.shortName)).startsWith(product.vendorCode)) {
      sanitizedShortName = _.join(_.initial(_.words(product.shortName)));
    }

    product.name = _.startCase(_.camelCase(sanitizedShortName));
  }

  product.slug = slugify(product.name);

  return product;
};

export const fetchProducts = _.memoize(async (productFilter) => {
  const productRows = await fetchProductRows();
  const products = productRows.map(convertProductRowToProduct);
  return rejectEmptyValues(_.filter(products, productFilter));
});

export const fetchProductById = _.memoize(async (productId) => {
  const productsWithId = await fetchProducts({ id: productId });
  if (productsWithId.length > 1) {
    throw new Error(`Duplicate productId “${productId}”`);
  }
  return _.head(productsWithId);
});

export const fetchProductCategoryCodes = _.memoize(async (productFilter) => {
  const products = await fetchProducts(productFilter);
  const productCategoryCodes = _.uniq(_.map(products, 'categoryCode'));
  return rejectEmptyValues(productCategoryCodes);
});

export const fetchProductCategories = _.memoize(async (productFilter) => {
  const productCategoryCodes = await fetchProductCategoryCodes(productFilter);
  const productCategories = await fetchCategories((category) =>
    _.includes(productCategoryCodes, category.code)
  );
  return rejectEmptyValues(productCategories);
});

export const fetchProductVendorCodes = _.memoize(async (productFilter) => {
  const products = await fetchProducts(productFilter);
  const productVendorCodes = _.uniq(_.map(products, 'vendorCode'));
  return rejectEmptyValues(productVendorCodes);
});

export const fetchProductVendors = _.memoize(async (productFilter) => {
  const productVendorCodes = await fetchProductVendorCodes(productFilter);
  const productVendors = await fetchVendors((vendor) =>
    _.includes(productVendorCodes, vendor.code)
  );
  return rejectEmptyValues(productVendors);
});
