import http from "http";
import SocketIO from "socket.io";
import express from 'express';

const app = express();

app.set("view engine","pug");
app.set("views",__dirname+"/views"); //views로 가게 함
app.use("/public", express.static(__dirname + "/public"));
//app.use메서드를 사용해, public이 src 안의 public이라고 지정해줌. 

app.get("/", (req,res)=>res.render("home"));
app.get("/*", (req,res)=>res.redirect("/"));

// const server = http.createServer(app);
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection",(socket)=>{ // 이벤트 핸들러로 connection을 추가
    socket["nickname"] = "Jane";

    // socket.onAny((e)=>{
    //     console.log(wsServer.sockets.adapter);
    //     console.log(`socket event : ${e}`);
    // })
    socket.on("enter_room",(roomName, done)=> { // 이 done이 showRoom임
        done();
        socket.join(roomName);
        console.log(socket.rooms)
        // socket.to(roomName).emit("welcome")
        socket.to(roomName).emit("welcome", socket.nickname)
    });
    socket.on("disconnecting", ()=>{
        socket.rooms.forEach(room=>socket.to(room).emit("bye", socket.nickname))
        //socket.rooms : 접속중인 채팅룸 set객체
    })
    socket.on("new_message", (msg, room, done)=>{
        socket.to(room).emit("new_message",`${socket.nickname}:${msg}`);
        done();
    })
    socket.on("nickname", (nickname)=>(socket["nickname"]=nickname));

});


const handleListen =() => console.log("z:Successfully listening on http://localhost:3000");
httpServer.listen(3000,handleListen);