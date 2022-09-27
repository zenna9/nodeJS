import http from "http";
import SocketIO from "socket.io";
import express from 'express';
let cons = require('consolidate');
const app = express();
// -----------------------
app.engine('html', cons.swig)
app.set('view engine', 'html');
// -----------------------

app.set("views",__dirname+"/views"); //views로 가게 함
app.use("/public", express.static(__dirname + "/public"));
// app.use메서드를 사용해, public이 src 안의 public이라고 지정해줌. 

app.get("/", (req,res)=>res.render("home"));
app.get("/*", (req,res)=>res.redirect("/"));

// const server = http.createServer(app);
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

const handleListen =() => console.log("z:Successfully listening on http://localhost:3000");
httpServer.listen(3000,handleListen);

