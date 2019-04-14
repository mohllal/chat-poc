/* jshint esversion: 6 */
const socket = io();

socket.on("connect", () => {
    console.log('Connected successfully');
});

socket.on("disconnect", () => {
    console.log('Disconnected successfully');
});

socket.on("newMessage", (message) => {
    var formattedTime = moment(message.createdAt).format("h:mm a");

    var li = jQuery('<li></li>');
    li.text(`${message.from} ${formattedTime}: ${message.text}`);
    jQuery('#messages').append(li);

    console.log('New message: ', message);
});

socket.on("newLocationMessage", (message) => {
    var formattedTime = moment(message.createdAt).format("h:mm a");

    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location</a>');

    li.text(`${message.from} ${formattedTime}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);

    console.log('New location message: ', message);
});

jQuery('#message-form').on('submit', (e) => {
    e.preventDefault();
    
    var messageTextBox = jQuery('#message');
    socket.emit('createMessage', {
        from: 'Standard User',
        text: messageTextBox.val()
    }, (data) => {
        messageTextBox.val('');
        console.log(data);
    });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', () => {
    if (!("geolocation" in navigator)) {
        /* geolocation IS NOT available */
        return alert('Your browser does not support geolocation...');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition((position) => {
        locationButton.removeAttr('disabled').text('Send location');
        console.log(position);
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, (error) => {
        locationButton.removeAttr('disabled').text('Send location');
        
        alert('Can not fetch your location...');
        console.log(error);
    });
});