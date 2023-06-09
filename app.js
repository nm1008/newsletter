//jshint esversion: 6

const express = require("express");
const request = require("request");
const https = require("https");
require('dotenv').config();



const app = express();
const api_key = process.env.API_KEY;

console.log(api_key);

const port = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.post("/", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.emailAddress;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us9.api.mailchimp.com/3.0/lists/2b336e1af4"

    const options = {
        method: "POST",
        auth: `Nikko1:${api_key}`
    }
    
    const request = https.request(url, options, (response) =>{
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
            
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
   
})

app.post("/failure", (req, res) => {
    res.redirect("/");
})

app.listen(process.env.PORT || port, () => {
    console.log(`Server is running on port ${port}`);
})

