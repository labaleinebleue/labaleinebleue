import slugify from '@sindresorhus/slugify';
import _ from 'lodash';
import objectMapper from 'object-mapper';
import { fetchDataRows } from './database';
import { rejectEmptyValues } from './util';

export const vendorSheetName = 'Fournisseurs';

export const expectedVendorColumnHeaders = ['Code Fournisseur', 'Libellé'];

export const defaultVendorDataRowFilter = (vendorDataRow) =>
  !_.isEmpty(vendorDataRow['Code Fournisseur']) &&
  !_.isEmpty(vendorDataRow['Libellé']);

const fetchVendorDataRows = async (
  vendorDataRowFilter = defaultVendorDataRowFilter
) =>
  fetchDataRows(vendorSheetName, expectedVendorColumnHeaders, {
    filter: vendorDataRowFilter,
  });

const convertVendorDataRowToVendor = (vendorDataRow) =>
  objectMapper(vendorDataRow, {
    'Code Fournisseur': 'code',
    Libellé: [['name'], ['slug', slugify]],
  });

export const fetchVendors = _.memoize(async (vendorFilter, options = {}) => {
  const { sortBy } = options;

  const vendorDataRows = await fetchVendorDataRows();
  const vendors = vendorDataRows.map(convertVendorDataRowToVendor);

  return _.sortBy(rejectEmptyValues(_.filter(vendors, vendorFilter)), sortBy);
});

export const fetchVendorByCode = _.memoize(async (vendorCode) => {
  const vendorsWithCode = await fetchVendors({ code: vendorCode });
  if (vendorsWithCode.length > 1) {
    throw new Error(`Duplicate Vendor for vendorCode “${vendorCode}`);
  }
  return _.head(vendorsWithCode);
});

export const fetchVendorBySlug = _.memoize(async (vendorSlug) => {
  const vendorsWithSlug = await fetchVendors({ slug: vendorSlug });
  if (vendorsWithSlug.length > 1) {
    throw new Error(`Duplicate Vendor for vendorSlug “${vendorSlug}`);
  }
  return _.head(vendorsWithSlug);
});
