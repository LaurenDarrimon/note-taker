const express = require('express');  //require express
const path = require('path');
const fs = require('fs');
const util = require('util');

const allNotes = require('./db/db.json');  //require the database where all the notes will be stored

const app = express();

var PORT = process.env.PORT || 3001;  //listen on this port 

//promisify the file system built in read file 
const readFromFile = util.promisify(fs.readFile);

// Middleware for parsing application/json and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));



//HTML ROUTES FOR PAGES
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);




//API ROUTES

// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get("/api/notes", function(req, res) {

    // Log our request to the terminal
    console.info(`${req.method} request received to get reviews`);

    //call the newly promisified readFRomFile function, which will
    //return a promise of the json data in the file 
    readFromFile("./db/db.json").then((data) => {
        console.log(JSON.parse(data));
        res.json(JSON.parse(data));
    });

});



// POST /api/notes should receive a new note to save on the request body, 
//add it to the db.json file, and then return the new note to the client. 
//You'll need to find a way to give each note a unique id when it's saved 
//(look into npm packages that could do this for you).

// app.post("/api/notes", function(req, res) {
//     res.getAndRenderNotes;
//     return res.json(allNotes);
// });

//WILDCARD route goes last so that it doesn't override api routess, 
//catches anything else. 
app.get('/*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen( PORT, () => console.log('Express Server on port 3001!'));