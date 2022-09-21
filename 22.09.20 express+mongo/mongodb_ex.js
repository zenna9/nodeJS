const http = require('http');
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const dbUrl = 'mongodb://localhost';

app.set('port', process.env.PORT || 3000);

let db = null;
// const client = new MongoClient(dbUrl);
// async function dbConn() {
//     await client.connect();
//     db = client.db('vehicle');
//     console.log('DB 접속 성공!');
// }
MongoClient.connect()

app.get('/', async (req, res)=>{
    if(db) {
        let car = await db.collection('car');
        let carList = await car.find({}).toArray();
        res.send(carList);
    }
});
app.get('/:carname', async (req, res)=>{
    if(db) {
        let carname = req.query.carname;
        console.log(carname);
        let car = await db.collection('car');
        let carList = await car.find({}).toArray();
        let selectedCar = carList.filter(item.name==carname);
        res.send(selectedCar);
    }
});

const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log('서버 실행 >>> localhost:' + app.get('port'));
    dbConn();
})
//dbConn().then(console.log).catch(console.error).finally(()=>client.close());