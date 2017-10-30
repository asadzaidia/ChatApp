const path=require('path');
const express=require('express');
const http=require('http');
const socketio=require('socket.io');
const {generateMessage,generateLocationMessage}=require('./utils/message');
const {isRealString}=require('./utils/validation');
const {Users}=require('./utils/users');
const publicPath=path.join(__dirname,'../public'); //its better to use it because of its feasability
// console.log(__dirname+'/../public');
const port=process.env.PORT || 3000;
console.log(publicPath);

var app=express();
var server=http.createServer(app);//making because chat use http
var io=socketio(server);//Integrating server to io
var users=new Users();
app.use(express.static(publicPath));

io.on('connection',(socket)=>{ // socket app is a parameter from index page io is a connection on is a method
console.log('New User Conneted');

socket.on('join',(params,callback)=>{

if(!isRealString(params.name) || !isRealString(params.room)){
  callback('Name and room name are required.');
}
socket.join(params.room);
users.removeUser(socket.id); //cannot join other rooms
users.addUser(socket.id,params.name,params.room);

//builtin socket functionality to make different rooms
//io.emit -> io.to('the office room').emit 'message only emitted to that room'
//socket.broadcast.emit->socket.broadcast.to('tje office room').emit
//socket.emit
io.to(params.room).emit('updateUserList',users.getUserList(params.room));
socket.emit('NewMessage',generateMessage('Admin','Welcome to the Chat app'));
socket.broadcast.to(params.room).emit('NewMessage',generateMessage('Admin',`${params.name} has joined`));
callback();
});

socket.on('createMessage',(message,callback)=>{ //callback is a function return from index emit
  console.log('createMessage',message);
  io.emit('NewMessage',generateMessage(message.from,message.text));
  callback('');
  // socket.broadcast.emit('NewMessage',{ //broadcast use when sending to everyone except yourself
  //   from:message.from,
  //   text:message.text,
  //   createdAt:new Date().getTime()
  // });
});

socket.on('createLocationMessage',(coords)=>{
io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));
});

socket.on('disconnect',()=>{
  // console.log('User was disconnected');
  var user=users.removeUser(socket.id);
  if(user){
    io.to(user.room).emit('updateUserList',users.getUserList(user.room));
    io.to(user.room).emit('NewMessage',generateMessage('Admin',`${user.name} has left`));
  }
});
});



server.listen(port,()=>{ //http connection because chat using that protocol
  console.log(`Server is up on ${port}`);
});
