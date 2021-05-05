const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var postSchema = new Schema({
    noidungbaiviet:String,
    idUser :{
        type: mongoose.Schema.ObjectId, 
        required: true
    },
    createdPost:String,
    photoPost :String
});

module.exports = mongoose.model('Post', postSchema);