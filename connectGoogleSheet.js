const {google} = require("googleapis");

const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
});

//Create client instance for auth
const client = async (req, res) => { 
    await auth.getClient();
}

// Instance of Google Sheets API
const googleSheets = google.sheets({version: "v4", auth: client});

// Get metadata about spreadsheet
const spreadsheetId = "1yP507efu2ELoFidpZT9Pe3XwVxFSRSylGh90LXORniA";

const metaData = async (req, res) => {
    await googleSheets.spreadsheets.get({
    auth: auth,
    spreadsheetId: spreadsheetId,
});
}

module.exports = {
    auth, googleSheets, spreadsheetId, metaData
}