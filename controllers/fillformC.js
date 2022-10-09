const {google} = require("googleapis");
const {auth, client, googleSheets, spreadsheetId} = require("../connectGoogleSheet");
const db = require("../connections/connectDB")
const mysql = require("mysql");
const logger = require('../logs/logger');

function intToChar(int) {
  // 👇️ for Uppercase letters, replace `a` with `A`
  const code = 'A'.charCodeAt(0);
  return String.fromCharCode(code + int);
}

const fillForm = async (req, res) => {
    const id = req.params.id;

    const metaData = await googleSheets.spreadsheets.get({
        auth: auth,
        spreadsheetId: spreadsheetId,
    });

    await googleSheets.spreadsheets.values.append({
        auth: auth,
        spreadsheetId: spreadsheetId,
        range: `Sheet1!A1:C1`,
        valueInputOption: "USER_ENTERED", 
        resource: {
            values: [
                ["Submitted By USER_ID", "Form Response ID", "Time of Submission"]
            ]
        }
    });

    let sql1 = `SELECT * FROM ${process.env.MYSQLDATABASE}.questions WHERE form_id = ${id};`;
    let query1 = db.query(sql1, async (err, result) => {
        if(err) throw err;
        // console.log(result);
        logger.info(`Form ${id} details have been updated`)
        for (let i = 0; i < result.length; i++) {
            var col = JSON.stringify(result[i].question_value);
            await googleSheets.spreadsheets.values.append({
            auth: auth,
            spreadsheetId: spreadsheetId,
            range: `Sheet1!${intToChar(i+3)}1:${intToChar(i+3)}1`,
            valueInputOption: "USER_ENTERED", 
            resource: {
                values: [
                    [`Q${i+1}: ` + col]
                ]
            }
        });
    }
    });
    let sql = `SELECT * FROM ${process.env.MYSQLDATABASE}.form_responses WHERE form_id = ${id};`;
    let query = db.query(sql, async (err, result) => {
        if(err) throw err;
        // console.log(result);
        for (let i = 0; i < result.length; i++) {
            var col1 = JSON.stringify(result[i].filled_by_user_id);
            var col2 = JSON.stringify(result[i].form_response_id);
            var col3 = JSON.stringify(result[i].time);
            await googleSheets.spreadsheets.values.append({
            auth: auth,
            spreadsheetId: spreadsheetId,
            range: "Sheet1!A2:C2",
            valueInputOption: "USER_ENTERED", 
            resource: {
                values: [
                    [col1,col2,col3]
                ]
            }

            
        });
        let sql3 = `SELECT response_value,question_id, form_response_id FROM ${process.env.MYSQLDATABASE}.question_responses WHERE form_response_id = ${result[i].form_response_id};`;
        let query3 = db.query(sql3, async (err, result) => {
            if(err) throw err;
            // console.log(result);
            for (let j = 0; j < result.length; j++) {
                var col = JSON.stringify(result[j].response_value);
                await googleSheets.spreadsheets.values.append({
                auth: auth,
                spreadsheetId: spreadsheetId,
                range: `Sheet1!${intToChar(j+3)}${2+i}:${intToChar(j+3)}${2+i}`,
                valueInputOption: "USER_ENTERED", 
                resource: {
                    values: [
                        [col]
                    ]
                }
            });
            
        }
        });
    }
    });
    
    

    res.send(`Sheet Updated with the details of form ${id}!`)
}


module.exports = {
    fillForm
}