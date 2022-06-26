  var socket = io();

  $(() => {
    $("#send").click( () => {
      var message ={
          "name": $("#name").val(),
          "message": $("#message").val()
        };
        if (message.name.length > 1 && message.message.length > 1) {
          postMessage(message);
        }
        $("#message").val("");
    });
    getMessages();
  });

socket.on('message', addMessage);

function addMessage(message) {
    console.log(message);
    if(message.time) {message.time = getDateString(message.time); } else {message.time = "unknown"}
    if(!message.name || message.name.toLowerCase() == "armani appolon"){message.name = "Annonymous User"}
    $("#messages").append(`<li id="${message._id}" class="message"><p class="small posted">posted: ${message.time}</p> <h3>${message.name}</h3> <p>${message.message}</p></li>`);
  }

function getMessages(){
  $.get('http://localhost:3000/messages', data => {
    data.forEach(addMessage);
  })
}

function postMessage(message){
  $.post('http://localhost:3000/messages', message);
}

function getDateString(milliseconds){
  const dateNames = {
    weekday: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    month: ["January","February","March","April","May","June","July","August","September","October","November","December"]
  };

  const d = new Date(milliseconds);
  let hour = d.getHours();
    if (hour > 12) { hour = hour - 12;}
    if (hour < 10 ) {hour = "0" + hour;}
  let minutes = d.getMinutes();
  let seconds = d.getSeconds();
    if (seconds < 10) {seconds = "0" + seconds}
  let ms = d.getMilliseconds();
  const day = dateNames.weekday[d.getDay()];
  const month = dateNames.month[d.getMonth()];
  const date = d.getDate();
  const year = d.getFullYear();

  const dstring = `${hour}:${minutes}:${seconds}:${ms}, ${day}, ${month}, ${date} ${year}`;

  return dstring;
}
const d = new Date();const time = d.getTime(); const x = getDateString(time); console.log(x);