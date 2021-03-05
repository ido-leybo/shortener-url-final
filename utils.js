const shortId = require("shortid");

function addZero(number){
    if (number < 10)
        return "0" + number;
    else
        return number;
}

function getCurrentDate(date) {
return addZero(date.getDate()) + "/" + addZero(date.getMonth() + 1) + "/" + date.getFullYear();
}



class Item {
    constructor(originalUrl) {
        this.creationDate = getCurrentDate(new Date());
        this.shortUrl = shortId.generate();
        this.originalUrl = originalUrl;
        this.redirectCount = 0;
    }
}

module.exports = Item;