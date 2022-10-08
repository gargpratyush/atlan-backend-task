const {google} = require("googleapis");
const {auth, client, googleSheets, spreadsheetId} = require("../connectGoogleSheet");

const clearForm =  async (req, res) => {
    const metaData = await googleSheets.spreadsheets.get({
        auth: auth,
        spreadsheetId: spreadsheetId,
    });

    await googleSheets.spreadsheets.values.clear({
        auth: auth,
        spreadsheetId: spreadsheetId,
        range: `Sheet1`
    }).data;

    res.send(metaData.data)
};

module.exports = {
    clearForm
}