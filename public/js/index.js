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
socket.on('newLocationMessage',function(message){
  var li=jQuery('<li></li>');
  var a=jQuery('<a target="_blank"> My current Location</a>');
  li.text(`${message.from}`);
  a.attr('href',message.url);
  li.append(a);
    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit',function(e){
  e.preventDefault();
  socket.emit('createMessage',{
    from:'User',
    text:jQuery('[name=message]').val()
  },function(){

  });
});

var locationButton=jQuery('#send-location');
locationButton.on('click',function(){
  if(!navigator.geolocation){
    return alert("No geolocation supported by your browser");
  }
  navigator.geolocation.getCurrentPosition(function(position){
    socket.emit('createLocationMessage',{
      latitude:position.coords.latitude,
      longitude:position.coords.longitude
    })
  },function(){
    alert('Unable to fetch Location');
  });
});
