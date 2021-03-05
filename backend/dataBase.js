const Item = require('../utils');
const fs = require("fs").promises;
const file = process.env.NODE_ENV === 'test' ? 'test.json' : 'data.json';

// class DataBase {
//     static urls = [];
    
//     static async readAllData() {
//         const data = await fs.readFile(`./backend/${dir}`, 'utf8' , (err, data) => {
//             if (err) {
//               console.error(err)
//               return
//             }
//             console.log(data)
//           })
//           let parseData = JSON.parse(data);
//           this.urls = parseData.links;
//     }
//     static async getOriginalUrl(id) {
//         await this.readAllData();
//         for(let item of this.urls) {
//             if(id === item.shortUrl) {
//                 item.redirectCount += 1;
//                 let json = JSON.stringify({"links": this.urls})
//                 fs.writeFile(`./backend/${dir}`, json)
//                 return item.originalUrl;
//             }
//         }
//         return null;  
//     }
//     static async getAllItemData(id) {
//         await this.readAllData();
//         // const url = this.urls.find(url => url.id === url.shortUrl);
//         for(let url of this.urls) {
//             if (url == null) {
//                 // throw new Error();
//                 return null;
//             }
//         }
//         for(let item of this.urls) { // TODO: use array functions
//             if(id === item.shortUrl) {
//                 return item;
//             }
//         }
//         return null; //TODO: throw error in case of error
//     }
// }

class DataBase {
    items;

    constructor() {
    }

    async readFile() {
        const data = await fs.readFile(`./backend/${file}`, 'utf8');
        this.items = JSON.parse(data);
    }

    async addItem(url) { 
        await this.readFile();
        const newItem = new Item(url);
        const match = (this.items).find(item => item.originalUrl === newItem.originalUrl)
        if(match != null) {
            return match.shortUrl; 
        }
        this.items.push(newItem);
        try {
            await fs.writeFile(`./backend/${file}`, JSON.stringify(this.items, null, 4));
            return newItem.shortUrl;
        } catch (err) {
            throw new Error(`${err}`)
        }
    }

    async getItem(id, type) {
        await this.readFile();
        const match = this.items.find(item => item.shortUrl === id)
        if(match == null) {
            throw new Error('item does not exists')
        }
        if(type === "website") {
            this.countRedirect(match, id)
        }
        return match;
    }

    async countRedirect(item, id) {
        if(item.shortUrl === id) {
            item.redirectCount += 1;
            await fs.writeFile(`./backend/${file}`, JSON.stringify(this.items, null, 4));
        }
    }
}
const dataBase = new DataBase()
module.exports = dataBase;
