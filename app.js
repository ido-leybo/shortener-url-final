require("dotenv").config();
const express = require("express");
const cors = require("cors");;
const app = express();
const shortId = require("shortid");
const fs = require("fs");
const { json } = require("body-parser");
const DataBase = require('./backend/dataBase')

app.use(cors());
app.use("/public", express.static(`./public`));
app.use(express.urlencoded({extended: false}));


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});


app.post('/api/shorturl', async (req, res) => {

  await DataBase.addUrlToFile(req.body);
  res.json(req.body)

})

// app.get("/:id", (req, res) => {
  
// });

// app.get("/:id", (req, res) => {
  
// });

module.exports = app;
