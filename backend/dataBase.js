const shortId = require("shortid");
const fs = require("fs").promises;


class DataBase {
    static urls = [];
    
    static async readAllData() {
        const data = await fs.readFile('./backend/data.json', 'utf8' , (err, data) => {
            if (err) {
              console.error(err)
              return
            }
            console.log(data)
          })
          let parseData = JSON.parse(data);
          this.urls = parseData.links;
    }
    static async addUrlToFile(reqBody) { 
        await this.readAllData();
        for(let item of this.urls) {
            if(item.originalUrl === reqBody.url) {
                return item.shortUrl;
            }
        }
        let fullUrlRequest = {
            creationDate: Date.now(),
            redirectCount: 0,
            originalUrl: reqBody.url,
            shortUrl: shortId.generate()  
        };
        this.urls.push(fullUrlRequest);
        let json = JSON.stringify({"links": this.urls})
        fs.writeFile(`backend/data.json`, json);
        return fullUrlRequest.shortUrl;
    }
    static async getOriginalUrl(id) {
        await this.readAllData();
        for(let item of this.urls) {
            if(id === item.shortUrl) {
                item.redirectCount += 1;
                let json = JSON.stringify({"links": this.urls})
                fs.writeFile(`backend/data.json`, json)
                return item.originalUrl;
            }
        }
        return null;  
    }
    static async getAllItemData(id) {
        await this.readAllData();
        for(let item of this.urls) {
            if(id === item.shortUrl) {
                return item;
            }
        }
        return null;
    }
}


module.exports = DataBase;
