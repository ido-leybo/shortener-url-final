require("dotenv").config();
const express = require("express");
const cors = require("cors");;
const app = express();
const shortId = require("shortid");
const isUrl = require("is-valid-http-url");
const dataBase = require('./backend/dataBase')
const Item = require('./utils');


app.set('view engine', 'pug')
app.use(cors());
app.use("/public", express.static(`./public`));
app.use(express.urlencoded({extended: false}));


app.get("/", (req, res) => {
  res.render('index')
});

// Add new url 
app.post('/api/shorturl', async (req, res) => {
  try {
    if(!isUrl(req.body.url)) { 
      res.status(400).send({error: 'url illegal'})
    } 
    const itemId = await dataBase.addItem(req.body.url);
    return res.status(201).render('printUrl', { 
      message: 'Your new link:', 
      id: `http://${req.get('Host')}/${itemId}`
    })
  } catch (err) {
    res.status(500).render('error', {status: 500, message: `${err}`})
  }
})

// Access get spacipic url  
app.get("/:id", async (req, res) => {
  if(!shortId.isValid(req.params.id)) {
    return res.status(400).render('error', {status: 400, message: "illegal id"})
  }
  try {
    const item = await dataBase.getItem(req.params.id, "website")
    console.log(item)
    res.redirect(item.originalUrl);
  } catch (err) {
    if(err == 'Error: item does not exists') {
      return res.status(404).render('error', {status: 404, message: "ID not found"})
    }
    res.status(500).render('error', {status: 500, message: `${err}`})
  }
});

// Access get spacipic url statistic  
app.get("/api/statistic/:id", async (req, res) => {
  if(!shortId.isValid(req.params.id)) {
    return res.status(400).render('error', {status: 400, message: "illegal id"})
  }
  try {
    const item = await dataBase.getItem(req.params.id);
    res.status(200).render('statistic', { 
      title: 'Statistic', 
      originalUrl: item.originalUrl, 
      shortUrl: item.shortUrl, 
      redirectCount: item.redirectCount, 
      creationDate: item.creationDate 
    })
  } catch (err) {
    if(err == 'Error: item does not exists') {
      return res.status(404).render('error', {status: 404, message: "ID not found"})
    }
    res.status(500).render('error', {status: 500, message: "Internal server error!"})
  }
});

module.exports = app;
