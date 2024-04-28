const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://DiyaVerma:Diya2004v@cluster0.3jjlegv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
const db = mongoose.connection;
db.on('error', console.error.bind(console, "MongoDB connection error"));
db.once('open', function() {
    console.log('Connected')});


//Models
require('./Category');
require('./Recipes');