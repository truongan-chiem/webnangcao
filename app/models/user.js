const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
var userSchema = new Schema({
    local:{
        username:String,
        password:String
    },
    google: {
        googleID:String,
        email: String,
        created: String,
        class:String,
        major:String,
        faculty:String
    },
    name: String,
    role:Array,
    image:String
    
});
//Hash mật khẩu
userSchema.methods.hashPw = function (password) {
    return bcrypt.hashSync(password,10);
};
// kiểm tra password có hợp lệ không
userSchema.methods.checkPw = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);