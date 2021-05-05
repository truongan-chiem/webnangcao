const express = require('express');
const Router = express.Router();
const siteController = require('../app/controllers/siteController')
const isLogin = require('../middleware/isLogin')

const multer = require('multer');
var storage = multer.diskStorage({
	destination: (req, file, cb) => {
	  cb(null, __dirname.replace('routers','public/uploads'))
	},
	filename: (req, file, cb) => {
	  cb(null, Date.now() + '-' + file.originalname)
	}
});
var upload = multer({storage: storage});
//baiviet
Router.get('/baiviet/:id',siteController.detailbaiviet)
Router.put('/baiviet/:id',upload.single('photoPost'),siteController.editbaiviet)
Router.post('/scrollbaiviet',siteController.baiviet)
Router.post('/baiviet',upload.single('photoPost'),siteController.postbaiviet)
Router.delete('/baiviet',siteController.delPost)
Router.get('/baiviet/all/:id',siteController.allPost)
//commmet
Router.get('/comment/:id',siteController.detailcomment)
Router.put('/comment/:id',siteController.editcomment)
Router.post('/comment',siteController.postCmt)
Router.delete('/comment',siteController.delCmt)

//home
Router.get('/',isLogin,siteController.home)
module.exports = Router;