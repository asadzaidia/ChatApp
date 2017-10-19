const path=require('path');
const express=require('express');
const http=require('http');
const socketio=require('socket.io');
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
socket.on('disconnect',()=>{
  console.log('User was disconnected');
});
});



server.listen(port,()=>{ //http connection because chat using that protocol
  console.log(`Server is up on ${port}`);
});
