require("dotenv").config();
const express = require("express");
const cors = require("cors");;
const app = express();
const DataBase = require('./backend/dataBase')

app.set('view engine', 'pug')
app.use(cors());
app.use("/public", express.static(`./public`));
app.use(express.urlencoded({extended: false}));


app.get("/", (req, res) => {
  // res.sendFile(__dirname + "/views/index.html");
  res.render('index')
});

app.post('/api/shorturl', async (req, res) => {

  const itemId = await DataBase.addUrlToFile(req.body);
  res.render('printUrl', { message: 'Your new link:', id: `http://${req.get('Host')}/${itemId}`})
})

app.get("/:id", async (req, res) => {
  const itemUrl = await DataBase.getOriginalUrl(req.params.id)
  if(itemUrl == null) { return res.sendStatus(404)}
  res.redirect(itemUrl);
});

app.get("/api/statistic/:id", async (req, res) => {
  const itemData = await DataBase.getAllItemData(req.params.id);
  if(itemData == null) {return res.sendStatus(404)}
  // res.json(itemData)
  res.render('statistic', { title: 'Hey', originalUrl: itemData.originalUrl, shortUrl: itemData.shortUrl, redirectCount: itemData.redirectCount, creationDate: itemData.creationDate })
});

module.exports = app;
