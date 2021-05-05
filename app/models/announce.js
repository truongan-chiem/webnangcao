const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var announceSchema = new Schema({
    title:String,
    content :String,
    createdAnnounce:String,
    idUserCreateAnnounce :{
        type: mongoose.Schema.ObjectId, 
        required: true
    }

});

module.exports = mongoose.model('Announce', announceSchema);