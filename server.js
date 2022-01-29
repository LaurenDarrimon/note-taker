const express = require('express');  //require express
const path = require('path');
const fs = require('fs');
const util = require('util');
const uniqid = require('uniqid');   //unique id generation 

const allNotes = require('./db/db.json');  //require the database where all the notes will be stored

const app = express();

var PORT = process.env.PORT || 3001;  //listen on this port 

//promisify the file system's built in read file 
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

    //call the newly promisified readFromFile function, which will
    //return a promise of the json data in the file 
    readFromFile("./db/db.json").then((data) => {
        console.log(JSON.parse(data));
        res.json(JSON.parse(data));
    });

});


// POST to receive a new note to save on the request body, 
// then, add it to the db.json file
//then return the new note to the client. 


// POST request to add a new note 
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a review`);
    console.info(req.body);
  
    // Destructuring assignment for the items in the body of the post request 
    const { title, text } = req.body;

    if (title && text) {
        const id = uniqid.process();
        const newNote = {
            title, 
            text,
            id, //12 digit unique id 
        }
  
        //Read the json file to get the existing notes
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
            console.error(err);
            } else {
            // take response string, parse into JSON object, store in new variable 
            const parsedNotes = JSON.parse(data);
    
            parsedNotes.push(newNote);  //push a new note into the object
    
            // write all the notes (old and new) back to the JSON file, overwrites the old version
            fs.writeFile( './db/db.json', JSON.stringify(parsedNotes, null, 2),
                (error) => {
                    if (error) {
                        console.error(error)
                    } else { 
                        console.info('Successfully updated reviews!')
                    }
                }
            )
            }
        });
  
        const response = {
        status: 'success',
        body: newNote,
        };
  
      console.log(response);
      res.json(response);
    } else {
      res.json('Error in posting note');
    }
  });


//WILDCARD route goes last so that it doesn't override other api routess, 
//catches anything else. 
app.get('/*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen( PORT, () => console.log('Express Server on port 3001!'));