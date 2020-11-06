import slugify from '@sindresorhus/slugify';
import _ from 'lodash';
import objectMapper from 'object-mapper';
import { fetchRows } from './inventory';
import { rejectEmptyValues } from './util';

const expectedVendorColumnHeaders = ['Code Fournisseur', 'Libellé'];

const defaultVendorRowFilter = (row) =>
  !_.isEmpty(row['Code Fournisseur']) && !_.isEmpty(row['Libellé']);

const fetchVendorRows = async (vendorRowFilter = defaultVendorRowFilter) =>
  fetchRows('Fournisseurs', expectedVendorColumnHeaders, {
    filter: vendorRowFilter,
  });

const convertVendorRowToVendor = (vendorRow) =>
  objectMapper(vendorRow, {
    'Code Fournisseur': 'code',
    Libellé: [['name'], ['slug', slugify]],
  });

export const fetchVendors = _.memoize(async (vendorFilter) => {
  const vendorRows = await fetchVendorRows();
  const vendors = vendorRows.map(convertVendorRowToVendor);
  return rejectEmptyValues(_.filter(vendors, vendorFilter));
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
