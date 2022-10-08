const {google} = require("googleapis");
const {auth, client, googleSheets, spreadsheetId} = require("../connectGoogleSheet");
const db = require("../connections/connectDB")
const mysql = require("mysql");

const collectResponse = async (req, res) => {
    const response_value = req.body.response_value;
    const question_id = req.body.question_id;
    const form_response_id = req.body.form_response_id;
    let sql = `INSERT INTO ATLAN_COLLECT.question_responses(response_value, question_id, form_response_id)
VALUES (${response_value}, ${question_id}, ${form_response_id});`;
    let query = db.query(sql, async (err, result) => {
        if(err) throw err;
        console.log(req.body.response_value);
        console.log(result);
        res.send(result)
    });
}


module.exports = {
    collectResponse
}