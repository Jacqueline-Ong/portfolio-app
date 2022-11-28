const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}));
const https = require('https');
const cookieParser = require('cookie-parser');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

app.use(cookieParser());
console.log('cookie parser test');
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render('home');
  });

app.get("/about", function(req, res){
  res.render('about');
});

const MongoClient = require('mongodb').MongoClient;


const CONNECTION_URL = "mongodb+srv://itsmejaong:Study1ng@portfolio-app.zba91ak.mongodb.net/test";
const DATABASE_NAME = "newdb"; // you can change the database name
var database, collection;

MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
  if(error) throw error;

  database = client.db(DATABASE_NAME);
  collection = database.collection("newcollection");
console.log('MongoDB connected')}); // you can change the collection name

  // Start the application after the database connection is ready
  
app.post("/", function(req, res) { 
  collection.insertOne(req.body, (err, result) => {  
    if (err) return console.log(err)

    console.log('saved to database')
    function formv3(){
      // Create the new request 
      var xhr = new XMLHttpRequest();
      var url = 'https://api.hsforms.com/submissions/v3/integration/submit/9059838/77c8fef7-52ad-45b0-9e13-c0b50357c441'
      
      // Example request JSON:
      var data = {
        "fields": [
          {
            "name": "email",
            "value": req.body.email
          },
          {
            "name": "firstname",
            "value": req.body.firstname
          }
        ],
        "context": {
          "hutk": req.cookies.hubspotutk,
          "pageUri": "https://thiswassubmittedonlocalhost.com",
          "pageName": "Local host submission"
        }
      }
  
      var final_data = JSON.stringify(data)
  
      xhr.open('POST', url);
      // Sets the value of the 'Content-Type' HTTP request headers to 'application/json'
      xhr.setRequestHeader('Content-Type', 'application/json');
  
      xhr.onreadystatechange = function() {
          if(xhr.readyState == 4 && xhr.status == 200) { 
              console.log(xhr.responseText); // Returns a 200 response if the submission is successful.
          } else if (xhr.readyState == 4 && xhr.status == 400){ 
              console.log(xhr.responseText); // Returns a 400 error the submission is rejected.          
          } else if (xhr.readyState == 4 && xhr.status == 403){ 
              console.log(xhr.responseText); // Returns a 403 error if the portal isn't allowed to post submissions.           
          } else if (xhr.readyState == 4 && xhr.status == 404){ 
              console.log(xhr.responseText); //Returns a 404 error if the formGuid isn't found     
          }
         }
  
  
      // Sends the request 
      
      xhr.send(final_data)
   }
  
   formv3();
   console.log('formv3 test');
   // or do something else here
    res.redirect('/') 
  })
});

app.listen(3000, function()
  {console.log("Server started on port 3000");}
);


// app.use('/static', express.static('public'));
