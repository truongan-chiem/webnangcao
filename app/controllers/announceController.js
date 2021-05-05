const User = require('../models/user')
const Announce = require('../models/announce')
const mongoose = require('mongoose');
const {mongooseToObject,mutipleMongooseToObject} = require('../../middleware/mongoose')
class announceController{
    //[GET] /
    getAnnounce(req,res){
        let id = req.user._id
        User.findById(id)
        .then(user=>{
            // console.log(req.session.passport.user._id)
            res.render('Announcement',{
                user : mongooseToObject(user)
            })
        })
        .catch(err=>{
            console.log(err)
        })
    }
    //[POST] /announce/getdataAnounce
    getdataAnounce(req,res){
        const currentId = req.user._id;
        const next = parseInt(req.body.next)
        const select = req.body.select
        let field = {$match: {}};
        if(select){
            field = {
                        $match: {'userCreate.role':select}
                    }
            }
        Announce.aggregate([
            {
                $lookup:
                {
                    from: "users",
                    localField: "idUserCreateAnnounce",
                    foreignField: "_id",
                    as: "userCreate"
                }
            }, 
            {
                $unwind: "$userCreate"
            },
            field
           
        ])
        .sort({_id:'desc'})
        .skip(next)
        .limit(10)
        .then((data)=>{
            
            res.json({data,currentId})
        })
        .catch(err=>{console.log(err)})
    }
    //[GET] /announce/create
    getformAnnounce(req,res){
        const errorAnnounce = req.flash('errorAnnounce') || '';
        const successAnnounce = req.flash('successAnnounce') || '';
        const title = req.flash('title') || '';
        const content = req.flash('content') || '';
        let id = req.user._id
        User.findById(id)
        .then(user=>{
            // console.log(req.session.passport.user._id)
            res.render('createAnnounce',{
                user : mongooseToObject(user),
                errorAnnounce,successAnnounce,title,content
            })
        })
        .catch(err=>{
            console.log(err)
        })
    }
    //[POST] /announce/create
    createAnnounce(req,res){
        const {title,content} = req.body;
        req.flash('title', title)
        req.flash('content', content)
        if(!title){
            req.flash(('errorAnnounce'),'Vui lòng điền tiêu đề!!!')
            return res.redirect('/announce/create')
        }
        else if(!content){
            req.flash(('errorAnnounce'),'Vui lòng điền nôi dung thông báo!!!')
            return res.redirect('/announce/create')
        }
        else{
            const date = new Date();

            const newAnnounce = new Announce();
            newAnnounce.title = title;
            newAnnounce.content = content;
            newAnnounce.idUserCreateAnnounce = req.user._id;
            newAnnounce.createdAnnounce = date.toLocaleString("en-NZ");

            newAnnounce.save()
            .then(()=>{
                req.flash(('successAnnounce'),'Tạo thông báo thành công!!!')
                req.session.flash.title =[] 
                req.session.flash.content =[] 
                res.redirect('/announce/create')
            })
            .catch(err=> {return req.flash('errorAnnounce',err)})

        }
    }
    //[GET] /announce/:id/edit
    getEditAnnounce(req,res){
        const idAnnounce = req.params.id;
        const msg = req.flash('msg') ||'';
        let id = req.user._id
        User.findById(id)
        .then(user=>{
            Announce.findOne({_id:idAnnounce})
            .then((Announce)=>{
                res.render('editAnnounce',{
                    user : mongooseToObject(user),
                    Announce : mongooseToObject(Announce),
                    msg
                })
            })
        })
        .catch(err=>console.log(err))
        
    }
    //[PUT] /announce/:id/edit
    EditAnnounce(req,res){
        const idAnnounce = req.params.id;
        const {title,content} = req.body;
        Announce.updateOne({_id:idAnnounce},{
            title:title,
            content:content
        })
        .then(()=>{
            req.flash('msg','Sửa bài viết thành công!!!')
            res.redirect('/announce/'+idAnnounce+'/edit')
        })
        .catch(err=>console.log(err))
        
    }
    //[GET] /announce/:id/detail
    detailAnnounce(req,res){
        const idAnnounce = req.params.id;
        let id = req.user._id
        User.findById(id)
        .then(user=>{
            Announce.aggregate([
                { 
                    $lookup:
                        {
                            from: "users",
                            localField: "idUserCreateAnnounce",
                            foreignField: "_id",
                            as: "userCreate"
                        }
                },
                { $match: { _id: new mongoose.Types.ObjectId(idAnnounce) } },
                {$unwind :"$userCreate"}
            ])
            .then((announce)=>{
                res.render('detail',{
                    announce,
                    user : mongooseToObject(user)
                })
            })
        })
        .catch(err=>console.log(err))
    }
    //[DELETE] /announce/:id
    delAnnounce(req,res){
        const idDelAnnounce = req.params.id;
        Announce.deleteOne({_id:idDelAnnounce})
        .then(()=>{
            res.redirect('/announce')
        })
        .catch(err=>console.log(err))
    }
    //[GET] /announce/room
    room(req,res){
        User.findById(req.user._id)
        .then(user=>{
            User.find({})
            .then(users=>{
                res.render('typeRoom',{
                    user:mongooseToObject(user),
                    users:mutipleMongooseToObject(users)
                })
            })
        })
        .catch(err=>console.log(err))
    }
}
module.exports = new announceController;
