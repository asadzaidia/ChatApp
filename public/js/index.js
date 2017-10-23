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
  var li=jQuery('<li></li>');//creating element
  li.text(`${message.from}: ${message.text}`);
  jQuery('#messages').append(li);
});

// socket.emit('createMessage',{
//   from:'asad',
//   text:'hi'
// },function(data){//data return from callback
//   console.log('Got It',data);
// });

jQuery('#message-form').on('submit',function(e){
  e.preventDefault();
  socket.emit('createMessage',{
    from:'User',
    text:jQuery('[name=message]').val()
  },function(){

  });
});
