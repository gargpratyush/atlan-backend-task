const express = require("express");
const {google} = require("googleapis");
const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "garg7019",
    database: "ATLAN_COLLECT"
})

const fillform = require('./routes/fillform')

// Connect
db.connect((err) => {
    if(err) {
        throw err;
    }
    console.log('MySql connected...')
});

// const pool = createPool({
//     host: "localhost",
//     user: "root",
//     password: "garg7019",
//     connectionLimit: 10
// })

// pool.query(`SELECT * FROM ATLAN_COLLECT.users`, (err, res) => {
//     return console.log("DB connected successfully");
// });

const app = express();

// Create DB
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE nodemysql';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Database created...')
    })
})

// app.use(express.json())

function intToChar(int) {
  // 👇️ for Uppercase letters, replace `a` with `A`
  const code = 'A'.charCodeAt(0);
//   console.log(code); // 👉️ 97

  return String.fromCharCode(code + int);
}

app.get("/form/:id", async (req, res) => {
    const id = req.params.id;
    // console.log('id is ' + id);
    
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    //Create client instance for auth
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({version: "v4", auth: client});

    // Get metadata about spreadsheet
    const spreadsheetId = "1yP507efu2ELoFidpZT9Pe3XwVxFSRSylGh90LXORniA";

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
                ["Submitted By", "Form Response ID", "Time of Submission"]
            ]
        }
    });

    metaData.data.properties.title = `Atlan-backend-task Form: ${id}`
    let sql1 = `SELECT * FROM ATLAN_COLLECT.questions WHERE form_id = ${id};`;
    let query1 = db.query(sql1, async (err, result) => {
        if(err) throw err;
        console.log(result);
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
    let sql = `SELECT * FROM ATLAN_COLLECT.form_responses WHERE form_id = ${id};`;
    // var responseobj;
    let query = db.query(sql, async (err, result) => {
        if(err) throw err;
        console.log(result);
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
        let sql3 = `SELECT response_value,question_id, form_response_id FROM ATLAN_COLLECT.question_responses WHERE form_response_id = ${result[i].form_response_id};`;
        // var responseobj;
        let query3 = db.query(sql3, async (err, result) => {
            if(err) throw err;
            console.log(result);
            for (let j = 0; j < result.length; j++) {
                var col = JSON.stringify(result[j].response_value);
                // console.log(`${intToChar(result.length+2)}`);
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
    
    

    res.send(metaData)
});

app.get("/clear", async (req, res) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    //Create client instance for auth
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({version: "v4", auth: client});

    // Get metadata about spreadsheet
    const spreadsheetId = "1yP507efu2ELoFidpZT9Pe3XwVxFSRSylGh90LXORniA";

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
});

app.listen(3000, (req,res) => console.log("Running on port 3000!"));

