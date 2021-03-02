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
        let fullUrlRequest = {
            creationDate: Date.now(),
            redirectCount: 0,
            originalUrl: reqBody.url,
            shortUrl: shortId.generate()  
        };
        
        this.urls.push(fullUrlRequest);
        // items.links.push(this.urls)
        let json = JSON.stringify({"links": this.urls})

        // let urlString = JSON.stringify(this.urls)
        // let urlsJson = {"links": urlString};

        fs.writeFile(`backend/data.json`, json)
    }


}



module.exports = DataBase;
