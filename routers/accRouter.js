const express = require('express');
const Router = express.Router();
const passport = require('passport');
const multer = require('multer');
const isLogin = require('../middleware/isLogin')
const accController = require('../app/controllers/accController')
//Auth Local login
Router.get('/login',accController.login)
Router.post('/login',accController.checkLogin,passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/acc/login',
    failureFlash: true 
}))

//Auth Google login
Router.get('/auth/google',passport.authenticate('google',{scope: ['profile', 'email']}));
Router.get('/auth/google/cb',passport.authenticate('google',{
    successRedirect:'/',
    failureRedirect:'/acc/login',
    failureFlash:true
}))
//Register
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,__dirname.replace('routers','public/uploads'))
    },
    filename: function (req, file, cb) {
      cb(null,Date.now() + '-' + file.originalname  )
    }
  })
   
const upload = multer({ storage: storage })

Router.get('/register',isLogin,accController.register)
Router.post('/register',upload.single('image'),accController.signup)
//Logout
Router.get('/logout',accController.logout)
//Update thong tin ca nhan
Router.get('/profile',isLogin,accController.getprofile)
Router.put('/profile',upload.single('image'),accController.updateprofile)
//update password
Router.get('/updatepw',isLogin,accController.getupdatepw)
Router.put('/updatepw',accController.updatepw)


module.exports = Router;