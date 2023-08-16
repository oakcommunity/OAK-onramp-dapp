require('dotenv').config();
const express = require('express');
const routes = require('./config/routes');
var cors = require('cors')
var bodyParser = require('body-parser')

var app = express();

app.use(cors());
app.use(bodyParser.json())
app.use('/', routes);

app.listen(8086,(e)=>{
    console.log('connected');
});