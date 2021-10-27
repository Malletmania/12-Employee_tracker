const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const dbPath = path.join(__dirname, '/db/db.json');

let getDB = () => JSON.parse(fs.readFileSync(dbPath));

let saveDB = (json) => fs.writeFile(dbPath, json, err => { err ? console.error(err) : console.log('Database Saved!'); });

const PORT = process.env.port || 3001;

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public", {
  extensions: ["html"]
}))

app.get('/api/notes', (req, res) =>
  res.json(getDB()))
;

app.post('/api/notes', (req, res) => {
  let json = getDB();
  let data = req.body;
  data.id = uuidv4();
  json.push(req.body)
  saveDB(JSON.stringify(json));
  res.redirect('/notes')
});
app.delete("/api/notes/:id", (req, res) => {
  saveDB(JSON.stringify(getDB().filter( row => row.id=== req.params.id)));
  res.status(200).send()
  // res.readAndAppend(path.join(__dirname, "/db/db.json"));
});

app.listen(8080)