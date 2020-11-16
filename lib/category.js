import slugify from '@sindresorhus/slugify';
import _ from 'lodash';
import objectMapper from 'object-mapper';
import { fetchInventoryRows } from './inventory';
import { rejectEmptyValues } from './util';

const expectedCategoryColumnHeaders = ['Code Famille', 'Libellé'];

const defaultCategoryRowFilter = (row) =>
  !_.isEmpty(row['Code Famille']) && !_.isEmpty(row['Libellé']);

const fetchCategoryRows = async (
  categoryRowFilter = defaultCategoryRowFilter
) =>
  fetchInventoryRows('Familles', expectedCategoryColumnHeaders, {
    filter: categoryRowFilter,
  });

const convertCategoryRowToCategory = (categoryRow) =>
  objectMapper(categoryRow, {
    'Code Famille': 'code',
    Libellé: [['name'], ['slug', slugify]],
  });

export const fetchCategories = _.memoize(async (categoryFilter) => {
  const categoryRows = await fetchCategoryRows();
  const categories = categoryRows.map(convertCategoryRowToCategory);
  return rejectEmptyValues(_.filter(categories, categoryFilter));
});

export const fetchCategoryByCode = _.memoize(async (categoryCode) => {
  const categoriesWithCode = await fetchCategories({ code: categoryCode });
  if (categoriesWithCode.length > 1) {
    throw new Error(`Duplicate category for categoryCode “${categoryCode}`);
  }
  return _.head(categoriesWithCode);
});

export const fetchCategoryBySlug = _.memoize(async (categorySlug) => {
  const categoriesWithSlug = await fetchCategories({ slug: categorySlug });
  if (categoriesWithSlug.length > 1) {
    throw new Error(`Duplicate category for categorySlug “${categorySlug}`);
  }
  return _.head(categoriesWithSlug);
});
