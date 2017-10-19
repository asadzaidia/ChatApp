const path=require('path');
const express=require('express');
const http=require('http');
const socketio=require('socket.io');
const {generateMessage}=require('./utils/message');
const publicPath=path.join(__dirname,'../public'); //its better to use it because of its feasability
// console.log(__dirname+'/../public');
const port=process.env.PORT || 3000;
console.log(publicPath);

var app=express();
var server=http.createServer(app);//making because chat use http
var io=socketio(server);//Integrating server to io
app.use(express.static(publicPath));

io.on('connection',(socket)=>{ // socket app is a parameter from index page io is a connection on is a method
console.log('New User Conneted');
//
// socket.emit('NewMessage',{ //emit matlab jo message bhjraha hai
//   from:'asadzaidi625@kkk.com',
//   msg:'Hello sending from a server side to a client',
//   createAt:1234
// });//newEmail is the defined in index custom event
socket.emit('NewMessage',generateMessage('Admin','Welcome to the Chat app'));
socket.broadcast.emit('NewMessage',generateMessage('Admin','New User Has Joined this'));


socket.on('createMessage',(message)=>{
  console.log('createMessage',message);
  io.emit('NewMessage',generateMessage(message.from,message.text));

  // socket.broadcast.emit('NewMessage',{ //broadcast use when sending to everyone except yourself
  //   from:message.from,
  //   text:message.text,
  //   createdAt:new Date().getTime()
  // });
});

socket.on('disconnect',()=>{
  console.log('User was disconnected');
});
});



server.listen(port,()=>{ //http connection because chat using that protocol
  console.log(`Server is up on ${port}`);
});
