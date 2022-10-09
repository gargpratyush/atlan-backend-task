
# Atlan Backend Task: System Design for Atlan Collect

This is my submission for the challenge for the Atlan backend internship. It involves designing the system for Atlan Collect. 

Collect﻿ is a data collection platform that is being used by customers in 50+ countries in over 250 organizations and has powered data collection for over 11 million responses.

I have linked the database with the Google Sheet and also developed a middleware for a particular business logic (see POST API Reference)

The server logs relevant data in the file ./logs/app.log



## Deployment

To deploy this project run

```bash
  npm install   //install all the dependencies
  nodemon index.js    //starts the node server

```

Create a new empty database and update the environment variables as shown below. 
Now use the dump sql file of my database and import it into your new datase.

```bash
  mysql   //connect to your mysql server
  create database {newDB} //replace 'newDB' with a name of your choice
  source {filesource} //paste the source of the dump sql file provided

```

Google Sheet Link: https://docs.google.com/spreadsheets/d/1yP507efu2ELoFidpZT9Pe3XwVxFSRSylGh90LXORniA/edit?usp=sharing

All the forms' responses can be viewed here.



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file


`MYSQLHOST` = localhost

`MYSQLUSER` = (Enter your username)

`MYSQLPASSWORD` = (Enter your password)

`MYSQLDATABASE` = ATLAN_COLLECT

`PORT` = 3000 (or any other port)


## API Reference

#### Get form responses

```http
  GET /form/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Id of the form to be fetched (1,2,3) |

Note: Run the next command before requesting for another form's responses.

For example: 

Request: GET localhost:3000/form/3

Expected Response: 'Sheet Updated with the details of form 3!'
The associated Google Sheet will be updated with all the form responses of the form with id 3.

#### Clear the associate Google Sheet

```http
  GET /form/clear
```

Clears the associated Google Sheet. 

Run this command before requesting for another form's responses.

#### Fill Form Responses

```http
  POST /collect
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `response_value` | `string` | **Required**. The response of the question |
| `question_id` | `string` | **Required**. The id of the question |
| `form_response_id` | `string` | **Required**. The id of the form_response data row |

Pass these values as JSON content along with the POST request in the body section.

For example: 

Request: POST localhost:3000/collect

{

  "response_value": "19",

  "question_id": "1",

  "form_response_id": "1"

}

Expected Response: Database will be updated and the JSON object of the result of the SQL Query will be responded back.

Age Logic:
If question_id == 1 && response_value < 18 then the entry won't be logged into the database and the server will respond with 'Age should be greater than 18 to fill this form' 