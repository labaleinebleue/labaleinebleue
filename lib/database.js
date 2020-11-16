/* global process */
import _ from 'lodash';
import { escapeRangeSheetName, getSpreadsheetValues } from './google-sheets';
import { omitEmptyValues, rejectEmptyValues } from './util';

// Fetch all values of a single sheet in the database spreadheet.
// Sheet is validated against expected column headers.
// `sheetName` is valid A1 range notation for “all cells in sheet `sheetName`”
// https://developers.google.com/sheets/api/guides/concepts#a1_notation
// The query is only done once per process execution, and is
// indefinitely memoized as a Promise to an array of row values.
const fetchDatabaseSheetValues = _.memoize(
  async (sheetName, expectedColumnHeaders) => {
    const response = await getSpreadsheetValues({
      spreadsheetId: process.env.DATABASE_SPREADSHEET_ID,
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
    const { values } = body;

    const columnHeaders = [...values[0]];

    if (columnHeaders.length !== expectedColumnHeaders.length) {
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

    return values;
  }
);

// “Data values” are all “values” from the sheet, minus the header.
// They are structured as an array of “rows of cells”.
// A “row of cells” is an array representing one row of data in the sheet.
// e.g.: [
//         ["1234", "TOY", "", "ABC", "Oui", ""],
//         ["5678", "PLUSH", "DEF", "", "Non", ""],
//         …
//       ]
export const fetchDatabaseSheetDataValues = async (
  sheetName,
  expectedColumnHeaders
) => {
  const values = await fetchDatabaseSheetValues(
    sheetName,
    expectedColumnHeaders
  );

  return [...values.slice(1)];
};

// “Data value ranges” are “value ranges” for all rows in the sheet, except the header.
// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values#ValueRange
// e.g.: [
//         { "range": "'Sheet Name'!A1:C1", "majorDimension": "ROWS", "values": ["1234", "TOY", ""] },
//         { "range": "'Sheet Name'!A2:C2", "majorDimension": "ROWS", "values": ["5678", "PLUSH", ""] },
//         …
//       ]
export const fetchDatabaseSheetDataValueRanges = async (
  sheetName,
  expectedColumnHeaders
) => {
  const dataValues = await fetchDatabaseSheetDataValues(
    sheetName,
    expectedColumnHeaders
  );

  const firstColumnLetter = 'A';
  const lastColumnLetter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[
    expectedColumnHeaders.length - 1
  ];

  return dataValues.map((rowOfCells, index) => ({
    range: `${escapeRangeSheetName(sheetName)}!${firstColumnLetter}${
      index + 2
    }:${lastColumnLetter}${index + 2}`,
    majorDimension: 'ROWS',
    values: rowOfCells,
  }));
};
// e.g.: `rowOfCells` = ["1234", "TOY", "", "ABC", "Oui", ""]
//       `expectedColumnHeaders` = ["Code", "Libellé", "Famille", "Fournisseur", "Publiable, "Observations"]
//     ⇒ { "Code": "1234", "Libellé": "TOY", "Fournisseur": "ABC", "Publiable": "Oui" }
const convertRowOfCellsToDataRow = (rowOfCells, expectedColumnHeaders) =>
  omitEmptyValues(_.zipObject(expectedColumnHeaders, rowOfCells));

// Return data from a given sheet as an array of “data row” objects.
// Sheet headers are validated against `expectedColumnHeaders`
// Data row object properties are keyed by header.
// Data row object properties with empty values are discarded.
// An optional filter is applied to resulting data rows.
export const fetchDataRows = async (
  sheetName,
  expectedColumnHeaders,
  options = {}
) => {
  const dataValues = await fetchDatabaseSheetDataValues(
    sheetName,
    expectedColumnHeaders
  );

  const dataRows = dataValues.map((rowOfCells) =>
    convertRowOfCellsToDataRow(rowOfCells, expectedColumnHeaders)
  );

  // When `filter` is undefined, `_.filter()` returns an array identical to the input array
  // https://lodash.com/docs/#filter
  const { filter } = options;
  return rejectEmptyValues(_.filter(dataRows, filter));
};
