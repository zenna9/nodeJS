const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');
const router = express.Router();
// route설정을 끝내고 createServer 전에 미들웨어 등록 해야 한다.
const expressErrorHandler = require('express-error-handler');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const formidable = require('formidable');
var fs = require('fs');
// 파일 업로드 기능
const multer = require('multer');
// 몽고디비
const mongojs = require('mongojs');
const db = mongojs('vehicle',['car']); //db vehicle의 car의미

app.set('port', process.env.PORT || 3000);
// 쿠키&세션 사용 설정
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

app.use(cors());
app.use('/files', express.static(__dirname + '/images'));
app.use('/upload', express.static(__dirname + '/upload'));
app.use(express.static('public'));

// bodyparser 미들웨어 등록
app.use(express.json());
app.use(express.urlencoded({extended:true}));

var storage = multer.diskStorage({
    destination : function(req, file,callback) {
        callback(null, 'upload');
    },
    filename : function(req, file, callback) {
        callback(null, Date.now() + "_" + file.originalname);
    }
});
// 파일 제한 : 최대 10개, 1G이하
var upload = multer({
    storage : storage,
    limits : {
        files: 10,
        fileSize : 1024 * 1024 * 1024
    }
});

// 데이터 저장 리스트npm 
const saramList = [];

//app.get("/", (req, res) => {
router.route('/').get((req, res) => {
    console.log("GET - / 요청");
    res.writeHead(200, {'Content-Type':'text/html; charset=UTF-8'});

    res.write("<h2>컴스터디 코딩스쿨</h2>");
    res.end();
});

// router.route('/form').get((req, res)=>{
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
//     res.write('<input type="file" name="filetoupload"><br>');
//     res.write('<input type="submit">');
//     res.write('</form>');
//     res.end();
// });


// router.route('/fileupload').post((req, res)=>{
//     var form = new formidable.IncomingForm();
//     form.parse(req, function (err, fields, files) {
//       var oldpath = files.filetoupload.filepath;
//       var newpath = __dirname+'/upload/' + files.filetoupload.originalFilename;
//       fs.rename(oldpath, newpath, function (err) {
//         if (err) throw err;
//         res.writeHead(200, {'Content-Type':'text/html; charset=UTF-8'});
//         res.write('<h3>File uploaded and moved!</h3>');
//         res.write(`<img src="/upload/${files.filetoupload.originalFilename}"/>`);
//         res.end();
//       });
//     });
// });


// router.route('/saram/list').get(function(req, res) {
//     res.send(saramList);
// });

// let pnoSequence = 4;
// router.route('/saram/input').post(upload.array('photo', 1), function(req, res) {
//     console.log('/saram/input', req.body.userid);
//     var files = req.files;
//     console.log(files[0]);

//     var fileInfo = files[0].path;
    
//     console.log(files.length);

//     let paramData = {
//         pno: pnoSequence++,
//         id : req.body.userid,
//         name : req.body.username,
//         email : req.body.email,
//         photo : fileInfo
//     }

//     saramList.push(paramData);
//     console.log(paramData);
//     res.send(saramList);
// });


//// -----------------------------------
app.use('/', router);
var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log('Running on ', app.get('port') );
});