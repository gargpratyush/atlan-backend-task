const express = require("express");
const fillform = require('./routes/fillform')

const app = express();

// app.use(express.json())
app.use('/form', fillform);


app.listen(3000, (req,res) => console.log("Running on port 3000!"));

