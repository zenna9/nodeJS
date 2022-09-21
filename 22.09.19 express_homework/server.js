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


//app.get("/", (req, res) => {
router.route('/').get((req, res) => {
    console.log("GET - / 요청");
    res.writeHead(200, {'Content-Type':'text/html; charset=UTF-8'});
    res.write("<h2>컴스터디 코딩스쿨</h2>");
    res.end();
});

router.route('/form').get((req, res)=>{
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    res.end();
});


router.route('/fileupload').post((req, res)=>{
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.filepath;
      var newpath = __dirname+'/upload/' + files.filetoupload.originalFilename;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.writeHead(200, {'Content-Type':'text/html; charset=UTF-8'});
        res.write('<h3>File uploaded and moved!</h3>');
        res.write(`<img src="/upload/${files.filetoupload.originalFilename}"/>`);
        res.end();
      });
    });
});



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