const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// 새로운 속성 추가
app.set('port', 3000);
app.set('views', __dirname + '/views'); // 폴더 경로
app.set('view engine', 'ejs'); // 확장자

// 미들웨어 추가
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let top = 1;
let carList = [
    {cno:top++, name:'SONATA', price:3500, company:'HYUNDAI', year:2020},
    {cno:top++, name:'GRANDUER', price:5500, company:'HYUNDAI', year:2020},
    {cno:top++, name:'BMW', price:5500, company:'BMW', year:2021},
    {cno:top++, name:'S80', price:6500, company:'VOLVO', year:2022}
];

// 라우트(route) 설정
app.get("/home", (req, res)=>{
    req.app.render('home', {carList}, (err, htmlData)=>{
        if(err) throw err;
        res.end(htmlData);
    });
});

// ejs 페이지로 forward
app.get("/input", (req, res)=>{
    req.app.render('input', {carList}, (err, htmlData)=>{
        if(err) throw err;
        res.end(htmlData);
    });
});
// input 데이터 처리
app.post("/input", (req, res)=>{
    let carData = {
        cno : top++, 
        name : req.body.name, 
        price : req.body.price, 
        company : req.body.company, 
        year : req.body.year
    };
    carList.push(carData);
    res.redirect("/home");
});

app.get("/detail/:cno", (req, res)=>{
    let idx = carList.findIndex((item)=>{
        console.log(item.cno, req.params.cno);
        return item.cno == Number(req.params.cno);
    });
    console.log(idx);
    let data = carList[idx];
    req.app.render('detail', {data}, (err, htmlData)=>{
        if(err) throw err;
        res.end(htmlData);
    });
});

app.get("/modify/:cno", (req, res)=>{
    let idx = carList.findIndex((item)=>{
        console.log(item.cno, req.params.cno);
        return item.cno == Number(req.params.cno);
    });
    console.log(idx);
    let data = carList[idx];
    req.app.render('modify', {data}, (err, htmlData)=>{
        if(err) throw err;
        res.end(htmlData);
    });
});

app.post("/modify", (req, res)=>{
    let carData = {
        cno : req.body.cno, 
        name : req.body.name, 
        price : req.body.price, 
        company : req.body.company, 
        year : req.body.year
    };
    let idx = carList.findIndex((item)=>{
        console.log(item.cno, req.body.cno);
        return item.cno == Number(req.body.cno);
    });
    carList[idx] = carData;
    res.redirect("/home");
});

app.get("/delete/:cno", (req, res)=>{
    let idx = carList.findIndex((item)=>{
        console.log(item.cno, req.params.cno);
        return item.cno == Number(req.params.cno);
    });
    console.log(idx);
    carList.splice(idx, 1);
    res.redirect("/home");
});

const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log('서버 실행 중 : http://localhost:3000');
});
