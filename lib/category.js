import slugify from '@sindresorhus/slugify';
import _ from 'lodash';
import objectMapper from 'object-mapper';
import { fetchDataRows } from './database';
import { rejectEmptyValues } from './util';

export const categorySheetName = 'Familles';

export const expectedCategoryColumnHeaders = ['Code Famille', 'Libellé'];

export const defaultCategoryDataRowFilter = (categoryDataRow) =>
  !_.isEmpty(categoryDataRow['Code Famille']) &&
  !_.isEmpty(categoryDataRow['Libellé']);

const fetchCategoryDataRows = async (
  categoryDataRowFilter = defaultCategoryDataRowFilter
) =>
  fetchDataRows(categorySheetName, expectedCategoryColumnHeaders, {
    filter: categoryDataRowFilter,
  });

const convertCategoryDataRowToCategory = (categoryDataRow) =>
  objectMapper(categoryDataRow, {
    'Code Famille': 'code',
    Libellé: [['name'], ['slug', slugify]],
  });

export const fetchCategories = _.memoize(async (categoryFilter) => {
  const categoryDataRows = await fetchCategoryDataRows();
  const categories = categoryDataRows.map(convertCategoryDataRowToCategory);
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
