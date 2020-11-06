/* global process */
import _ from 'lodash';
import { getSpreadsheetValues } from './google-sheets';
import { omitEmptyValues, rejectEmptyValues } from './util';

// Fetch all values of a single sheet in the inventory spreadheet.
// `sheetName` is valid A1 range notation for “all cells in sheet `sheetName`”
// https://developers.google.com/sheets/api/guides/concepts#a1_notation
// The query is only done once per process execution, and is
// indefinitely memoized as a Promise to an array of rows.
const fetchInventorySheetValues = _.memoize(async (sheetName) => {
  const response = await getSpreadsheetValues({
    spreadsheetId: process.env.INVENTORY_SPREADSHEET_ID,
    range: sheetName,
  });

  const { data: body } = response;

  // Assert that values in the reponse are, indeed, rows.
  // https://developers.google.com/sheets/api/reference/rest/v4/Dimension
  const { majorDimension } = body;
  if (majorDimension !== 'ROWS') {
    throw new Error(
      `Invalid major dimension in reponse for sheet “{$sheetName}” (expected “ROWS”, found “${majorDimension}”)`
    );
  }

  return body.values;
});

// Return data from a given sheet as an array of “row” objects.
// Sheet headers are validated against `expectedColumnHeaders`
// Row object properties are keyed by header.
// Row object properties with empty values are discarded.
// An optional filter is applied to resulting rows.
export const fetchRows = async (
  sheetName,
  expectedColumnHeaders,
  options = {}
) => {
  const values = await fetchInventorySheetValues(sheetName);

  const columnHeaders = [...values[0]];
  const dataArrays = [...values.slice(1)];

  if (columnHeaders.length !== expectedColumnHeaders.length) {
    console.log(columnHeaders);
    throw new Error(
      `Invalid column headers length for sheet “${sheetName}” (expected ${expectedColumnHeaders.length}, found ${columnHeaders.length})`
    );
  }

  for (let index = 0; index < columnHeaders.length; index++) {
    if (columnHeaders[index] !== expectedColumnHeaders[index]) {
      throw new Error(
        `Invalid column header #${index} for sheet “${sheetName}” (expected “${expectedColumnHeaders[index]}”, found “${columnHeaders[index]}”)`
      );
    }
  }

  // e.g.: “data arrays” [["1234", "TOY", "", "ABC", "Oui", "", ""], …]
  //     ⇒ “rows”        [{ "Code": "1234", "Désignation": "TOY", "Code Fournisseur": "ABC", "Publiable": "Oui" }, …]
  const rows = dataArrays.map(
    _.flow([(row) => _.zipObject(expectedColumnHeaders, row), omitEmptyValues])
  );

  // When `filter` is undefined, `_.filter()` returns an array identical to the input array
  // https://lodash.com/docs/#filter
  const { filter } = options;
  return rejectEmptyValues(_.filter(rows, filter));
};
