import slugify from '@sindresorhus/slugify';
import _ from 'lodash';
import objectMapper from 'object-mapper';
import { convertCodeToId } from './id';
import { fetchCategories } from './category';
import { fetchDataRows } from './database';
import { fetchVendors } from './vendor';
import { rejectEmptyValues } from './util';

export const productSheetName = 'Articles';

export const expectedProductColumnHeaders = [
  'Code Produit',
  'Libellé Caisse',
  'Code Famille',
  'Code Fournisseur',
  'Publiable',
  'Libellé',
  'Images Fournisseur',
  'Métadonnées Images',
];

export const defaultProductDataRowFilter = (productDataRow) =>
  productDataRow['Publiable'] === 'Oui' &&
  !_.isEmpty(productDataRow['Code Produit']) &&
  !_.isEmpty(productDataRow['Code Famille']) &&
  !_.isEmpty(productDataRow['Code Fournisseur']) &&
  (!_.isEmpty(productDataRow['Libellé Caisse']) ||
    !_.isEmpty(productDataRow['Libellé']));

const fetchProductDataRows = async (
  productDataRowFilter = defaultProductDataRowFilter
) =>
  fetchDataRows(productSheetName, expectedProductColumnHeaders, {
    filter: productDataRowFilter,
  });

const convertProductDataRowToProduct = (productDataRow) => {
  const convertVendorImageFileNameStringsToImages = (
    vendorImageFileNameStrings
  ) => {
    if (_.isEmpty(vendorImageFileNameStrings)) {
      return;
    }
    const vendorImageFileNames = vendorImageFileNameStrings.split('\n');

    if (_.isEmpty(productDataRow['Métadonnées Images'])) {
      return;
    }
    const imageMetaDatas = JSON.parse(productDataRow['Métadonnées Images']);

    const images = [];

    for (const vendorImageFileName of vendorImageFileNames) {
      const vendorImageMetaData = _.get(imageMetaDatas, vendorImageFileName);
      if (vendorImageMetaData) {
        const { href, width, height } = vendorImageMetaData;
        images.push({ href, width, height });
      }
    }

    if (!_.isEmpty(images)) {
      return images;
    }
  };

  // Directly map most product data row property values to product properties
  // `id` is a 10 digits digest of `code`
  const product = objectMapper(productDataRow, {
    'Code Produit': [['code'], ['id', convertCodeToId]],
    'Libellé Caisse': 'shortName',
    'Code Famille': 'categoryCode',
    'Code Fournisseur': 'vendorCode',
    'Images Fournisseur': [
      ['images', convertVendorImageFileNameStringsToImages],
    ],
  });

  // if no mapping property is found,
  // then `name` defaults to a sanitized version of `shortName`
  if (!_.isEmpty(productDataRow['Libellé'])) {
    product.name = productDataRow['Libellé'];
  } else {
    let sanitizedShortName = product.shortName;
    // Heuristic: if the first letters of `shortName`’s last word
    // match `vendorCode`, then it probably is a redundant use of
    // vendor code, which we want removed as part of sanitization
    if (
      _.last(_.words(product.shortName)).startsWith(product.vendorCode) ||
      product.vendorCode.startsWith(_.last(_.words(product.shortName)))
    ) {
      sanitizedShortName = _.join(_.initial(_.words(product.shortName)));
    }

    product.name = _.startCase(_.camelCase(sanitizedShortName));
  }

  product.slug = slugify(product.name);

  return product;
};

export const fetchProducts = _.memoize(async (productFilter) => {
  const productDataRows = await fetchProductDataRows();
  const products = productDataRows.map(convertProductDataRowToProduct);
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
