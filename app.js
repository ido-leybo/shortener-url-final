require("dotenv").config();
const express = require("express");
const cors = require("cors");;
const app = express();
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

app.get("/:id", async (req, res) => {
  const itemUrl = await DataBase.getOriginalUrl(req.params.id)
  if(itemUrl == null) {res.sendStatus(404)}
  res.redirect(itemUrl);
});

app.get("/api/statistic/:id", async (req, res) => {
  const itemData = await DataBase.getAllItemData(req.params.id);
  if(itemData == null) {res.sendStatus(404)}
  res.json(itemData)
});

module.exports = app;
