const User = require('../models/user')
const {mongooseToObject} = require('../../middleware/mongoose')
const fs = require('fs')
class accController{
    //[GET] acc/login
    login(req,res) {
        res.render('login',{msg:req.flash('errorLogin')})    
    }
    checkLogin(req,res,next){
        const {username,password} = req.body;
        if(!username){
            req.flash('errorLogin','Vui lòng điền tài khoản!!!');
        }
        else if(!password){
            req.flash('errorLogin','Vui lòng điền mật khẩu!!!');
        }
        next()
    }
    //[GET] acc/register
    register(req,res){
        const errorRegister = req.flash('errorRegister') || '';
        const successRegister = req.flash('successRegister') || '';
        const username = req.flash('username') || '';
        const name = req.flash('name') || '';
        const password = req.flash('password') || '';
        const repassword = req.flash('repassword') || '';
        User.findById(req.user._id)
        .then(user=>{
            // console.log(req.session.passport.user._id)
            res.render('register',{
                user : mongooseToObject(user),
                errorRegister,successRegister,username,name,password,repassword
            })
        })
        .catch(err=>{
            console.log(err)
        })
    }

    //[POST] acc/register
    signup(req,res){
        // console.log(req.body)
        const image = req.file;
        const {username,name,password,repassword,role} = req.body;
        req.flash('username', username)
        req.flash('name', name)
        req.flash('password', password)
        req.flash('repassword', repassword)
        if(!username){
            req.flash(('errorRegister'),'Vui lòng điền tài khoản!!!')
            return res.redirect('/acc/register')
        }
        else if(!password){
            req.flash(('errorRegister'),'Vui lòng điền mật khẩu!!!')
            return res.redirect('/acc/register')
        }
        else if(!repassword){
            req.flash(('errorRegister'),'Vui lòng xác nhận mật khẩu!!!')
            return res.redirect('/acc/register')
        }
        else if(password!=repassword){
            req.flash(('errorRegister'),'Mật khẩu xác nhận không đúng!!!')
            return res.redirect('/acc/register')
        }
        else if(!image){
            req.flash(('errorRegister'),'Chưa chọn ảnh đại diện!!!')
            return res.redirect('/acc/register')
        }
        else if(!name){
            req.flash(('errorRegister'),'Vui lòng điền tên phòng hoặc khoa!!!')
            return res.redirect('/acc/register')
        }
        else if(!role){
            req.flash(('errorRegister'),'Vui lòng phân quyền cho tài khoản!!!')
            return res.redirect('/acc/register')
        }
        else{
            User.findOne({'local.username':username})
            .then(user=>{
                if(user){
                    req.flash(('errorRegister'),'Tài khoản đã tồn tại vui lòng điền tài khoản khác!!!')
                    return res.redirect('/acc/register')
                }
                else{
                    const newUser = new User();
                    newUser.local.username = username;
                    newUser.local.password = newUser.hashPw(password);
                    newUser.name = name;
                    newUser.image=image.filename;
                    newUser.role=role;
                    newUser.save((err) => {
                        if (err) {
                        req.flash("errorRegister", err);
                        return res.redirect('/acc/register')
                        } else {
                            req.flash('successRegister','Tạo tài khoản thành công !!!')
                            req.session.flash.username =[] 
                            req.session.flash.name =[] 
                            req.session.flash.password =[] 
                            req.session.flash.repassword =[] 
                            res.redirect('/acc/register')
                        }
                      });
                }
            })
            .catch(err=> {return req.flash('errorRegister',err)})
        }
    }
    //[GET] acc/logout
    logout(req,res){
        req.logout();
        res.redirect('/acc/login')
    }
    //[GET] acc/updateprofile
    getprofile(req,res){
        const major = req.flash('major') ||'';
        const classstudent = req.flash('classstudent') ||'';
        const faculty = req.flash('faculty') ||'';
        const errorProfile = req.flash('errorProfile') ||'';
        const successProfile = req.flash('successProfile') ||'';
        User.findById(req.user._id)
        .then(user=>{
            res.render('profile',{
                user : mongooseToObject(user),
                errorProfile,successProfile,major,classstudent,faculty
            })
        })
        .catch(err=>console.log(err))
    }
    //[PUT] acc/updateprofile
    updateprofile(req,res){
        const {name,classstudent,major,faculty} = req.body;
        req.flash('classstudent',classstudent)
        req.flash('major',major)
        req.flash('faculty',faculty)
        if(!name){
            req.flash('errorProfile','Vui lòng điền họ và tên!!!');
            return res.redirect('/acc/profile')
        }
        else if(!classstudent){
            req.flash('errorProfile','Vui lòng điền lớp!!!');
            return res.redirect('/acc/profile')
        }
        else if(!major){
            req.flash('errorProfile','Vui lòng điền chuyên ngành!!!');
            return res.redirect('/acc/profile')
        }
        else if(!faculty){
            req.flash('errorProfile','Vui lòng điền khoa!!!');
            return res.redirect('/acc/profile')
        }
        else{
            const image = req.file;
            let newimage = req.user.image;
            if(image){
                newimage = image.filename;
            }
            User.updateOne({_id:req.user._id},{
                name:name,
                'google.class':classstudent,
                'google.major':major,
                'google.faculty':faculty,
                image:newimage
            })
            .then(()=>{
                req.flash(('successProfile'),'Cập nhật thông tin tài khoản thành công!!!')
                return res.redirect('/acc/profile')
            })
            .catch(err=>{
                req.flash('errorProfile',err)
                return res.redirect('/acc/profile')
            })
        }
    }
    //[GET] acc/updatepw
    getupdatepw(req,res){
        const errorUpdate = req.flash('errorUpdate') || '';
        const successUpdate = req.flash('successUpdate') || '';
        const passwordOld = req.flash('passwordOld') || '';
        const passwordNew = req.flash('passwordNew') || '';
        const repasswordNew = req.flash('repasswordNew') || '';
        User.findById(req.user._id)
        .then(user=>{
            // console.log(req.session.passport.user._id)
            res.render('updatepassword',{
                user : mongooseToObject(user),
                errorUpdate,successUpdate,passwordOld,passwordNew,repasswordNew
            })
        })
        .catch(err=>{
            console.log(err)
        })
        
    }
    //[PUT] acc/updatepw
    updatepw(req,res){
        const {passwordOld,passwordNew,repasswordNew} = req.body;
        req.flash('passwordOld',passwordOld)
        req.flash('passwordNew',passwordNew)
        req.flash('repasswordNew',repasswordNew)
        if(!passwordOld){
            req.flash(('errorUpdate'),'Vui lòng nhập mật khẩu cũ!!!')
            return res.redirect('/acc/updatepw')
        }
        else if(!passwordNew){
            req.flash(('errorUpdate'),'Vui lòng nhập mật khẩu mới!!!')
            return res.redirect('/acc/updatepw')
        }
        else if(!repasswordNew){
            req.flash(('errorUpdate'),'Vui lòng nhập xác nhận mật khẩu mới!!!')
            return res.redirect('/acc/updatepw')
        }
        else if(passwordNew!= repasswordNew){
            req.flash(('errorUpdate'),'Xác nhận mật khẩu không trùng khớp!!!')
            return res.redirect('/acc/updatepw')
        }
        else{
            User.findById(req.user._id)
            .then(user=>{
                if(!user.checkPw(passwordOld)){
                    req.flash(('errorUpdate'),'Mật khẩu cũ không chính xác!!!')
                    return res.redirect('/acc/updatepw')
                }
                else{
                    const pw = user.hashPw(passwordNew)
                    User.updateOne({_id:req.user._id},{'local.password':pw})
                    .then(()=>{
                        req.flash(('successUpdate'),'Cập nhật mật khẩu thành công!!!')
                        req.session.flash.passwordOld =[] 
                        req.session.flash.passwordNew =[] 
                        req.session.flash.repasswordNew =[]
                        return res.redirect('/acc/updatepw')
                    })
                    .catch(err=>{
                        req.flash(('errorUpdate'),err) 
                        return res.redirect('/acc/updatepw')
                    })
                }
            })
        }
    }
}
module.exports = new accController;
