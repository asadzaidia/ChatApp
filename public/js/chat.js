var socket=io();//make connection and save it in socket variable

function scrollToBottom(){//function for auto scrolling
  //Selectors
  var message=jQuery('#messages');
  var NewMessage=message.children('li:last-child')//give last child
  //Heights

  var clientHeight=message.prop('clientHeight');// builtin in js to get Heights
  var scrollTop=message.prop('scrollTop');
  var scrollHeight=message.prop('scrollHeight');
  var newMessageHeight=NewMessage.innerHeight();
  var lastMessageHeight=NewMessage.prev().innerHeight();
  if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight>=scrollHeight){
    message.scrollTop('scrollHeight');
  }

}
socket.on('connect',function(){ //on connection
  // console.log('connected to server');
  var params=jQuery.deparam(window.location.search); //for deparam Url
  socket.emit('join',params,function(err){
    if(err){
      alert(err);
      window.location.href='/';
    }else{
      console.log('No Error');
    }
  });


});
socket.on('disconnect',function(){
  console.log('disconnected from server');
});
socket.on('updateUserList',function(users){
  var ol=jQuery('<ol></ol>');
  users.forEach(function(user){
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ol);
});
socket.on('NewMessage',function(message){ //custom event
var formattedTime=moment(message.createdAt).format('h:mm a');
//   var li=jQuery('<li></li>');//creating element
//   li.text(`${message.from} ${formattedTime}: ${message.text}`);
//   jQuery('#messages').append(li);
var template=jQuery('#message-template').html();
var html=Mustache.render(template,{
  text:message.text,
  from:message.from,
  createdAt:formattedTime
});
jQuery('#messages').append(html);
scrollToBottom();

});

// socket.emit('createMessage',{
//   from:'asad',
//   text:'hi'
// },function(data){//data return from callback
//   console.log('Got It',data);
// });
socket.on('newLocationMessage',function(message){
  var formattedTime=moment(message.createdAt).format('h:mm a');
  // var li=jQuery('<li></li>');
  // var a=jQuery('<a target="_blank"> My current Location</a>');
  // li.text(`${message.from} ${formattedTime}`);
  // a.attr('href',message.url);
  // li.append(a);
  var template=jQuery('#location-message-template').html();
  var html=Mustache.render(template,{
    from:message.from,
    createdAt:formattedTime,
  url:message.url
  });

    jQuery('#messages').append(html);
    scrollToBottom();
});

jQuery('#message-form').on('submit',function(e){
  e.preventDefault();
  socket.emit('createMessage',{
    from:'User',
    text:jQuery('[name=message]').val()
  },function(){
jQuery('[name=message]').val('');
  });
});

var locationButton=jQuery('#send-location');
locationButton.on('click',function(){
  if(!navigator.geolocation){
    return alert("No geolocation supported by your browser");
  }
  locationButton.attr('disabled', 'disabled').text('Sending location...');
  navigator.geolocation.getCurrentPosition(function(position){
      locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage',{
      latitude:position.coords.latitude,
      longitude:position.coords.longitude
    })
  },function(){
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch Location');
  });
});
