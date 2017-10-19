var socket=io();//make connection and save it in socket variable
socket.on('connect',function(){ //on connection
  console.log('connected to server');
  // socket.emit('createMessage',{
  //   to:'Bilal@gmail.com',
  //   text:'message from client side'
  // });

});
socket.on('disconnect',function(){
  console.log('disconnected from server');
});

socket.on('NewMessage',function(message){ //custom event
  console.log('NewMessage',message);
});
