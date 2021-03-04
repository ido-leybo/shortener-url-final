require("dotenv").config();
const express = require("express");
const cors = require("cors");;
const app = express();
const shortId = require("shortid");
const DataBase = require('./backend/dataBase')


app.set('view engine', 'pug')
app.use(cors());
app.use("/public", express.static(`./public`));
app.use(express.urlencoded({extended: false}));

// Check if url is valid
// function isValidURL(req, res, next) {
//   console.timeLog(req.body.url)
//   res = (req.body.url).match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
//   if(res !== null){
//     next()
//   } else {
//     return res.status(400)
//   }
// };

app.get("/", (req, res) => {
  res.render('index')
});

// Add new url 
app.post('/api/shorturl', async (req, res) => {
  try {
  const itemId = await DataBase.addUrlToFile(req.body);
  if(itemId == null) { return res.sendStatus(400)}
  return res.status(201).render('printUrl', { 
      message: 'Your new link:', 
      id: `http://${req.get('Host')}/${itemId}`
  })
  } catch (err) {
    res.sendStatus(500)
  }
})

// Access get spacipic url  
app.get("/:id", async (req, res) => {
  if(!shortId.isValid(req.params.id)) {
    return res.status(400).render('error', {status: 400, message: "illegal id"})
  }
  try {
    const itemUrl = await DataBase.getOriginalUrl(req.params.id)
    if(itemUrl == null) { return res.sendStatus(404)}
    res.redirect(itemUrl);
  } catch (err) {
    res.status(500).render('error', {status: 500, message: "we have a problem!"})
  }
});

// Access get spacipic url statistic  
app.get("/api/statistic/:id", async (req, res) => {
  if(!shortId.isValid(req.params.id)) {
    return res.status(400).render('error', {status: 400, message: "illegal id"})
  }
  try {
    const itemData = await DataBase.getAllItemData(req.params.id);
    if(itemData == null) {return res.sendStatus(404)}
    res.status(200).render('statistic', { 
      title: 'Statistic', 
      originalUrl: itemData.originalUrl, 
      shortUrl: itemData.shortUrl, 
      redirectCount: itemData.redirectCount, 
      creationDate: itemData.creationDate 
    })
  } catch (err) {
    res.status(500).render('error', {status: 500, message: "we have a problem!"})
  }
});

module.exports = app;
