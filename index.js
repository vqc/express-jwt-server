//Imports
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

//DB Setup
mongoose.connect('mongodb://admin:password@ds053218.mlab.com:53218/auth-express-react-webpack-redux')

//instance of express
const app = express();

//App Setup

  //morgan and bodyParser are middleware
  //morgan is a logging framework
app.use(morgan('combined'));
  //bodyParser parses requests as JSON
app.use(bodyParser.json({type:'*/*'}));
  //cors is a middleware
  //specifically to fix the CORS principle
  //can add config to limit
app.use(cors());
router(app);

//Server Setup
const port = process.env.PORT || 4040;
const server = http.createServer(app);
server.listen(port);
console.log('server listening to port', port);
