const  mongo = require('mongoose');
const  bodyParser = require('body-parser')
const express = require('express');
const cookieParser= require('cookie-parser');
const logger = require('morgan');
const  cors = require("cors");


const app = express();



const DB = "mongodb+srv://usman:78504040@cluster0.579u8ty.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongo.connect(DB).then(()=>{
    console.log("connected to database !")
}).catch(()=>{
    console.log("Not connected!");
});

app.use(cors());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Use Routes
app.use(require('../routes/quizRoutes'));
app.use(require('../routes/userRoutes'));








app.listen(8001,()=>{
    console.log("Your server is running on port 8001");
});

module.exports =app;