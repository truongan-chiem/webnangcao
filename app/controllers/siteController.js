const User = require('../models/user')
const Post = require('../models/posts')
const Comment = require('../models/comments')
const Announce = require('../models/announce')
const mongoose = require('mongoose');
const {mongooseToObject,mutipleMongooseToObject} = require('../../middleware/mongoose')
class siteController{
    //[GET] /
    home(req,res){
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
                {$unwind :"$userCreate"}
            ])
            .sort({_id:'desc'})
            .limit(10)
            .then(announce=>{
                // console.log(req.session.passport.user._id)
                res.render('home',{
                    user : mongooseToObject(user),
                    announce
                })
            })
        })
        .catch(err=>{
            console.log(err)
        })
  
    }

    //[POST] /scrollbaiviet
    baiviet(req,res){
        const currentId = req.user._id;
        const skip = parseInt(req.body.skip)
        
        Post.aggregate([
            {
                $lookup:
                {
                    from: "comments",
                    localField: "_id",
                    foreignField: "idPost",
                    as: "CmtInPost"
                }
            },
           {
                $lookup:
                {
                    from: "users",
                    localField: "idUser",
                    foreignField: "_id",
                    as: "InfoUser"
                }
            },
            {
                $unwind: "$InfoUser"
            }
        ])
        .sort({_id:'desc'})
        .skip(skip)
        .limit(10)
        .then((posts)=>{
           
            res.json({posts,currentId})
        })
        .catch(err=>console.log(err))
        
    }
    //[POST] /baiviet
    postbaiviet(req,res){
        let photoPost ;
        if(req.file){
            photoPost = req.file.filename;
        }
        const date = new Date();
        const newPost = new Post();

        newPost.noidungbaiviet = req.body.noidungbaiviet;
        newPost.idUser = req.user._id;;
        newPost.photoPost =photoPost;
        newPost.createdPost = date.toLocaleString("en-NZ");
        
        newPost.save()
        .then(()=>{
            res.json(req.body)
        })
        .catch(err=>{
            console.log(err)
        })

    }
    //[DELETE] /baiviet
    delPost(req,res){
        const idDelPost = req.body.idDelPost;
        Post.deleteOne({_id:idDelPost})
        .then(()=>{
            Comment.deleteMany({idPost:idDelPost})
            .then(()=>{
                
                res.json({idDelPost})
            })
            
        })
        .catch((err)=>{console.log(err)})
        
    }
    //[GET] /detailbaiviet/:id
    detailbaiviet(req,res){
        const idPost = req.params.id;
        Post.findOne({_id:idPost})
        .then((post)=>{
            res.json({post})
        })
        .catch(err=>console.log(err))
    }
    //[PUT] /detailbaiviet/:id
    editbaiviet(req,res){
        const idPost = req.params.id;
        let photoPost;
        Post.findOne({_id:idPost})
        .then((post)=>{
            if(req.file){
                photoPost = req.file.filename;
                
            }
            else{
                photoPost = post.photoPost
            }
            const noidungbaiviet = req.body.noidungbaiviet;
            Post.updateOne({_id:idPost},{noidungbaiviet:noidungbaiviet,photoPost:photoPost})
            .then(()=>{
                res.json({noidungbaiviet,photoPost,idPost})
            })
            
        })
        .catch(err=>console.log(err))
    }
    //[GET] /baiviet/all/:id
    allPost(req,res){
        const idUsers = req.params.id;
        User.findById(req.user._id)
        .then(user=>{
            Post.aggregate([
                {
                    $lookup:
                    {
                        from: "comments",
                        localField: "_id",
                        foreignField: "idPost",
                        as: "CmtInPost"
                    }
                },
               {
                    $lookup:
                    {
                        from: "users",
                        localField: "idUser",
                        foreignField: "_id",
                        as: "InfoUser"
                    }
                },
                {
                    $unwind: "$InfoUser"
                },
                {
                    $match:{ idUser: new mongoose.Types.ObjectId(idUsers)}
                }
            ])
            .sort({_id:'desc'})
            .then(data=>{
                let nameuser;
                if(data.length>0){
                    nameuser = data[0].InfoUser.name;
                }
                res.render('allPostsUser',{
                    user:mongooseToObject(user),
                    data,
                    nameuser
                })
            })

        })
        .catch(err=>console.log(err))
    }
    //[POST] /comment
    postCmt(req,res){
        
        const idPost = req.body.idPost;
        const cmt = req.body.cmt;
        const date = new Date();
        
        Post.findById(idPost)
        .then((post)=>{
            if(!post){
                res.json({ message: "Post not found"})
            }
            else{
                const newComment = new Comment();
                newComment.idPost = idPost;
                newComment.cmt = cmt;
                newComment.nameUserCmt = req.user.name;
                newComment.imageUserCmt = req.user.image;
                newComment.idUserCmt = req.user._id;
                newComment.createdCmt = date.toLocaleString("en-NZ");
        
                newComment.save()
                .then((infoCmt)=>{
                    res.json(infoCmt)
                })
                .catch((err)=>{
                    console.log(err)
                })
            }
        })
        

    }
    //[GET] /comment/:id
    detailcomment(req,res){
        const idCmt = req.params.id;
        Comment.findOne({_id:idCmt})
        .then((cmt)=>{
            res.json({cmt})
        })
        .catch(err=>console.log(err))
    }
    //[PUT] /comment/:id
    editcomment(req,res){
        const idCmt = req.params.id;

        const cmt = req.body.cmt;
        Comment.updateOne({_id:idCmt},{cmt})
        .then(()=>{
            
            res.json({cmt,idCmt})
        })
            
        .catch(err=>console.log(err))
    }
    //[DELETE] /comment
    delCmt(req,res){
        const idDelCmt = req.body.idDelCmt;
        Comment.deleteOne({_id:idDelCmt})
        .then(()=>{
            res.json({idDelCmt})
        })
        .catch(err=>{
            console.log(err)
        })
    }
}
module.exports = new siteController;
