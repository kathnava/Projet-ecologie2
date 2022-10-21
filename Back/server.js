const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser  = require('body-parser');
const path = require('path');
const apiRouter = require('./routes/apiRouter').router;
require('dotenv').config()
//const cors = require('cors');
// const userfetch = require('./userfetch');
//const { render } = require('ejs');
const { response } = require('express');

//const corsOptions = {
 //   'Access-Control-Allow-Origin': '*'
//}

// Instantiate server
var server = express();

// Body Parser configuration
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cookieParser());
//server.use(cors(corsOptions));

// Declare API routes
server.use('/api/', apiRouter);

server.listen(process.env.APP_PORT, function() {
    console.log('Server ------ BACK ------ en écoute :)' ,process.env.APP_PORT);
})

