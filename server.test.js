const app = require('./app')
// const puppeteer = require('puppeteer');
const supertest = require("supertest");
const request = supertest(app);
const fs = require("fs").promises;
const file = process.env.NODE_ENV === 'test' ? 'test.json' : 'bins.json';



beforeEach(async () => {
    await fs.writeFile(`./backend/test.json`, JSON.stringify([]));
});

describe("POST route", () => {

    it("Should post new url item", async () => {
        const response = await request.post('/api/shorturl').type('form').send({url: 'https://www.npmjs.com/package/puppeteer'})
        expect(response.status).toBe(201)
    })
    test("URL illegal", async () => {
        const response = await request.post('/api/shorturl').type('form').send({url: 'htoverflowpt-string-is-a-url'})
        expect(response.status).toBe(400)
        expect(response.body.error).toEqual('url illegal')
    })
    test("Corrupted file in the dataBase", async () => {
        await fs.writeFile(`./backend/${file}`, "[");
        const response = await request.post('/api/shorturl').type('form').send({url:'https://www.youtube.com/?hl=iw&gl=IL'});
        expect(response.status).toBe(500)
    });
});

describe("Get routes by given ID", () => {
    let fullUrlRequest = {
        creationDate: '04/03/2021',
        redirectCount: 0,
        originalUrl: 'https://www.youtube.com/?hl=iw&gl=IL',
        shortUrl: 'Abcd1324'  
    }
    let json = JSON.stringify([fullUrlRequest])
    
    it("Should can get url by id", async () => {
        await fs.writeFile(`./backend/${file}`, json)
        const response = await request.get(`/Abcd1324`);
        expect(response.status).toBe(302)
    })

    test("ID illegal", async () => {
        const response = await request.get(`/asd`);
        expect(response.status).toBe(400)
    })

    it("ID not found", async () => {
        const response = await request.get(`/Abcdfg23`);
        expect(response.status).toBe(404)
    })

    test("Corrupted file in the dataBase", async () => {
        await fs.writeFile(`./backend/${file}`, "[");
        const response = await request.get(`/Abcd1324`);
        expect(response.status).toBe(500);
    });

});

describe("Get routes fot Statistic by given ID", () => {
    let fullUrlRequest = {
        creationDate: '04/03/2021',
        redirectCount: 0,
        originalUrl: 'https://www.youtube.com/?hl=iw&gl=IL',
        shortUrl: 'Abcd1324'  
    }
    let json = JSON.stringify([fullUrlRequest])
    
    it("Should can get url statistic by id", async () => {
        await fs.writeFile(`./backend/${file}`, json)
        const response = await request.get(`/api/statistic/Abcd1324`);
        expect(response.status).toBe(200)
    })

    test("Check if ID legal", async () => {
        const response = await request.get(`/api/statistic/asd`);
        expect(response.status).toBe(400)
    })

    it("ID not found", async () => {
        const response = await request.get(`/api/statistic/Abcdfg23`);
        expect(response.status).toBe(404)
    })

    test("Corrupted file in the dataBase", async () => {
        await fs.writeFile(`./backend/${file}`, "[");
        const response = await request.get(`/api/statistic/Abcd1324`);
        expect(response.status).toBe(500);
    });

});