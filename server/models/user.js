const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let userSchema = new Schema({
    password: String,  //密码
    account: String,  // 账号
    chineseName: String, //中文名称
    phone: String,      //手机号
    email: String, //邮箱
    avatar: String,   //头像
}, {versionKey: false, timestamps: true});
module.exports = mongoose.model('user', userSchema);