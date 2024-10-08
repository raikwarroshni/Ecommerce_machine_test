const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Replace with your Google Spreadsheet ID
const SPREADSHEET_ID = '1WAE9xofZXLacibB15BnwwpR5nAl-otRtXJGebVzVrQg';
let sheetName = 'Sheet1';  // Initial sheet name

// Load the service account credentials
const credentials = JSON.parse(fs.readFileSync(path.join(__dirname, './google.json')));

// Authorize with the Google Sheets API
async function authenticate() {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return auth.getClient();
}

// Function to check if the sheet is full (example: if it has more than a certain number of rows)
async function isSheetFull(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  console.log('Checking sheet:', sheetName);

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:A`,
    });

    const rowCount = response.data.values ? response.data.values.length : 0;
    const maxRows = 10;  // Define what "full" means

    return rowCount >= maxRows;
  } catch (error) {
    console.error('Error checking sheet fullness:', error);
    return false;  // Return false if there is an error in fetching data
  }
}

// Function to create a new sheet with a unique name
async function createNewSheet(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  const newSheetName = `Sheet_${Date.now()}`;  // Create a unique sheet name using a timestamp

  const request = {
    spreadsheetId: SPREADSHEET_ID,
    resource: {
      requests: [{
        addSheet: {
          properties: {
            title: newSheetName
          }
        }
      }]
    }
  };

  try {
    const response = await sheets.spreadsheets.batchUpdate(request);
    console.log(`New sheet '${newSheetName}' created.`);
    return newSheetName;
  } catch (error) {
    console.error('Error creating new sheet:', error);
    return null;
  }
}

// Function to get the last sheet name from the spreadsheet
async function getLastSheetName(auth) {
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheetTitles = response.data.sheets.map(sheet => sheet.properties.title);
    const lastSheet = sheetTitles[sheetTitles.length - 1];
    return lastSheet;  // Return the name of the last sheet
  } catch (error) {
    console.error('Error getting last sheet name:', error);
    return 'Sheet1';  // Fallback to the first sheet if there's an error
  }
}

// Function to insert data into the sheet
async function insertData(auth) {
  const sheets = google.sheets({ version: 'v4', auth });

  // Get the last sheet name and check if it's full
  sheetName = await getLastSheetName(auth);

  if (await isSheetFull(auth)) {
    // If the current sheet is full, create a new one
    sheetName = await createNewSheet(auth);
  }

  const request = {
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A1`,  // Starting point of data insertion
    valueInputOption: 'USER_ENTERED', // Options: 'RAW' or 'USER_ENTERED'
    resource: {
      values: [  // Column headers
        ['10', 'Alice', '24'],   // Row 1 data
        ['20', 'Bob', '27'],     // Row 2 data
        ['10', 'Charlie', '22']  // Row 3 data
      ],
    },
  };

  try {
    const response = await sheets.spreadsheets.values.append(request);
    console.log('Data successfully inserted into:', sheetName);
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

// Main function
async function main() {
  const auth = await authenticate();
  await insertData(auth);
}

main().catch(console.error);
