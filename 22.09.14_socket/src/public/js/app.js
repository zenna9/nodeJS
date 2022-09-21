const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
const ableRooms = document.getElementById("ableRooms");
form.addEventListener("submit",handleRoomSubmit);
room.hidden = true;
let roomName;

// 입장 가능한 방 목록
// function setRoomList(roomList){
//     roomList.forEach(element => {
//         let li = document.createElement(li);
//         li.innerText = element;
//         ableRooms.appendChild(li);
//     });
// }

// 메시지 입력창 보이기
function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3=room.querySelector("h3");
    h3.innerHTML = `room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    const nameForm = room.querySelector("#name") ;
    
    msgForm.addEventListener("submit",handleMessageSubmit);
    nameForm.addEventListener("submit",handleNicknameSubmit);
}
// 방 입장시 
function handleRoomSubmit(event){
    event.preventDefault();
    console.log("enter!")
    const input = form.querySelector("input");
    socket.emit("enter_room",input.value,showRoom);
    roomName = input.value;
    input.value="";
}

// 닉네임 입력
function handleNicknameSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#name input");
    const value = input.value;
    socket.emit("nickname",value);
    input.value="";
}

// 누가 채팅방에 들어오면 화면에 표시
function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerHTML = message;
    ul.appendChild(li);
}

// 메시지 제출 이벤트
function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", value, roomName, ()=>{
        addMessage(`you: ${value}`);
    });
    input.value="";
}

socket.on("welcome", (nickname)=>{
    addMessage(`${nickname} joined!`);
})
socket.on("bye", (nickname)=>{
    addMessage(`${nickname} left...`)
})
socket.on("new_message",(msg)=>{
    addMessage(msg);
})
// // 접속 가능한 방들 보여주기?
socket.on("room_change",(rooms)=>{
    // console.log(rooms); // 이건 브라우저의 콘솔에 뜨는거얌 ^_^
    const roomList = document.querySelector("#forEveryone ul");
    roomList.innerHTML ="";
    if(rooms.length ===0){
        return;
    }
    rooms.forEach((room)=>{
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
})