const Item = require('../utils');
const fs = require("fs").promises;
const file = process.env.NODE_ENV === 'test' ? 'test.json' : 'data.json';

class DataBase {
    items;

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
