import { google } from 'googleapis';

const googleSheetsApi = google.sheets('v4');

// By means of the “Application Default Credentials” (ADC) strategy,
// the Google Auth Library uses the `GOOGLE_APPLICATION_CREDENTIALS`
// environment variable to authenticate the Service Account
// that will access the Google Cloud APIs.
// https://cloud.google.com/docs/authentication/production
const getReadOnlyAuthClient = async () => {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  return await auth.getClient();
};

const getReadWriteAuthClient = async () => {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return await auth.getClient();
};

// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/get
export const getSpreadsheet = async ({ spreadsheetId }) =>
  await googleSheetsApi.spreadsheets.get({
    auth: await getReadOnlyAuthClient(),
    spreadsheetId,
  });

// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get
export const getSpreadsheetValues = async ({ spreadsheetId, range }) =>
  await googleSheetsApi.spreadsheets.values.get({
    auth: await getReadOnlyAuthClient(),
    spreadsheetId,
    range,
  });

// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/update
export const updateSpreadsheetValues = async ({
  spreadsheetId,
  range,
  values,
  valueInputOption = 'USER_ENTERED',
}) =>
  await googleSheetsApi.spreadsheets.values.update({
    auth: await getReadWriteAuthClient(),
    spreadsheetId,
    range,
    valueInputOption,
    requestBody: {
      values,
    },
  });

// https://support.google.com/docs/thread/6497633?hl=en
export const escapeRangeSheetName = (sheetName) =>
  `'${sheetName.replace(RegExp("'", 'g'), "''")}'`;
