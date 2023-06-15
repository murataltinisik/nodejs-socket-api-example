const socket = io.connect('http://localhost:3000/')

// VARIABLES
const users = {};

// DOM
const sendBUTTON = document.getElementById("send-message");
const messagesContainer = document.getElementById('messages');
const feedbackContainer = document.getElementById('feedback');
const textINPUT = document.getElementById("form-message-text");
const numberOfUsersSPAN = document.getElementById("numberOfUsers");
const usernameINPUT = document.getElementById("form-message-username");

function listElement(username, message){
    messagesContainer.innerHTML += '<div class="message"><span class="username">'+ username +'</span> <span class="text">'+ message +'</span></div>';
}

/** SEND BUTTON */
sendBUTTON.addEventListener('click', () => {
    if(usernameINPUT.value.length === 0){
        usernameINPUT.style.borderColor = "red";
    }else if(textINPUT.value.length === 0){
        textINPUT.style.borderColor = "red";
    }else{
        textINPUT.style.borderColor = "#eee";
        usernameINPUT.style.borderColor = "#eee";

        socket.emit("send-message", {
            text: textINPUT.value,
            username: usernameINPUT.value,
        });
        textINPUT.value = "";
        setInterval(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight
        });
    }
});

/** TEXT INPUT SOCKET -> WRITING */
textINPUT.addEventListener('keyup', () => {
    socket.emit('writing', usernameINPUT.value);
});

/** SEND MESSAGE SOCKET */
socket.on('send-message', (data, numberOfUsers) => {
    listElement(data.username, data.text)
    feedbackContainer.innerHTML = ""
    users[data.client_id] = data.username;
    numberOfUsersSPAN.innerText = `(${numberOfUsers})`;
});

/** WRITING SOCKET */
socket.on('writing', username => {
    feedbackContainer.innerHTML = `<p><strong>${username}: </strong> Yazıyor...</p>`;
});