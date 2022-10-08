const {google} = require("googleapis");
const {auth, client, googleSheets, spreadsheetId} = require("../connectGoogleSheet");
const logger = require('../logs/logger');

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

    logger.info("Sheet is cleared")
    res.send(`Sheet Cleared!`)
};

module.exports = {
    clearForm
}