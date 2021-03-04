const shortId = require("shortid");
const fs = require("fs").promises;
const isUrl = require("is-valid-http-url");
const dir = process.env.NODE_ENV === 'test' ? 'test.json' : 'data.json';

class DataBase {
    static urls = [];
    
    static async readAllData() {
        const data = await fs.readFile(`./backend/${dir}`, 'utf8' , (err, data) => {
            if (err) {
              console.error(err)
              return
            }
            console.log(data)
          })
          let parseData = JSON.parse(data);
          this.urls = parseData.links;
    }
    static async addUrlToFile(url) { 
        await this.readAllData();

        // Check if url legal
        if(!isUrl(url)) { // TODO change reqbody to url
            return null;
        }
        
        for(let item of this.urls) {
            if(item.originalUrl === url) {
                return item.shortUrl;
            }
        }
        // create new item
        let fullUrlRequest = {
            creationDate: this.getCurrentDate(new Date()),
            redirectCount: 0,
            originalUrl: url,
            shortUrl: shortId.generate()  
        };
        this.urls.push(fullUrlRequest);
        let json = JSON.stringify({"links": this.urls})
        fs.writeFile(`./backend/${dir}`, json);
        return fullUrlRequest.shortUrl;
    }
    static async getOriginalUrl(id) {
        await this.readAllData();
        for(let item of this.urls) {
            if(id === item.shortUrl) {
                item.redirectCount += 1;
                let json = JSON.stringify({"links": this.urls})
                fs.writeFile(`./backend/${dir}`, json)
                return item.originalUrl;
            }
        }
        return null;  
    }
    static async getAllItemData(id) {
        await this.readAllData();
        // const url = this.urls.find(url => url.id === url.shortUrl);
        for(let url of this.urls) {
            if (url == null) {
                // throw new Error();
                return null;
            }
        }
        for(let item of this.urls) { // TODO: use array functions
            if(id === item.shortUrl) {
                return item;
            }
        }
        return null; //TODO: throw error in case of error
    }
    static getCurrentDate(date){
        return addZero(date.getDate()) + "/" + addZero(date.getMonth() + 1) + "/" + date.getFullYear();
    
        function addZero(number){
            if (number < 10)
                return "0" + number;
            else
                return number;
        }
    }
}



module.exports = DataBase;
