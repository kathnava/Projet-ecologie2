const express = require('express');
const bodyParser  = require('body-parser');
const path = require('path');
const userRoutes = require('./routes/userRoute')
// Instantiate server
var server = express();

// Body Parser configuration
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// config view engine
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));
server.set('/img', path.join(__dirname + '/public'));

//server.use(express.static(path.join(__dirname + '/public')));
server.set('/css', path.join(__dirname + '/public'));
server.set('/js', path.join(__dirname + 'public'));
server.use(express.static(__dirname+ '/public'))



// Declare API routes
server.use('/', userRoutes);

server.listen(8181, function() {
    console.log('Server ----- FRONT ------ en écoute :)');
})

