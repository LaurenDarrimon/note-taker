const express = require('express');  //require express
const path = require('path');

const reviews = require('./db/db.json');  //require the database where all the notes will be stored

const app = express();

var PORT = process.env.PORT || 3001;  //listen on this port 

// Middleware for parsing application/json and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


app.get('/*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);



app.listen( PORT, () => console.log('Express Server on port 3001!'));