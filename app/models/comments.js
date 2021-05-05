const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var commentSchema = new Schema({
    idPost:{ 
        type: mongoose.Schema.ObjectId, 
        required: true
    },
    cmt:String,
    nameUserCmt:String,
    imageUserCmt :String,
    createdCmt:String,
    idUserCmt:{
        type: mongoose.Schema.ObjectId, 
        required: true
    }
});

module.exports = mongoose.model('Comment', commentSchema);