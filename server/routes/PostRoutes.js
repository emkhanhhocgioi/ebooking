
const express = require('express');
const routerPost = express.Router();
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const { route } = require('./accountRoutes');

const {createPost,fecthUserPost, fecthAllPost,
   renderPostImage
  ,countrating,sortingPost,updatePost,deleteExistPostimg,fetchUserFollowed,
  getgptdata} = require('../Controller/PostController')

// MongoDB connection string

const storage = new GridFsStorage({
  url: 'mongodb://localhost:27017/hardwaredb',
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  
  file:(req,file)=>{
    
    const postID = req.body.PostID;
    
    if (!postID) {
      throw new Error('postID is missing');
    }
    console.log(postID)
 
    return{
      filename:file.originalname,
      bucketName:'POSTIMGS',
      metadata:{
        postID: postID,
        
      }
    }
  }
})

const upload = multer({storage,
    limits: { fieldSize: 25 * 1024 * 1024,}, 
})

routerPost.post("/createpost",upload.array('file',4),createPost)
routerPost.get("/getuserpost",fecthUserPost)
routerPost.get('/getpost',fecthAllPost)
routerPost.get('/getpostimg',renderPostImage)
routerPost.get('/countRating',countrating)
routerPost.post('/getpost/sorted',sortingPost)
routerPost.post('/updatepost',upload.array('file',4),updatePost)
routerPost.post('/delete/postexistimg',deleteExistPostimg)
routerPost.get('/fetchUserFollowed',fetchUserFollowed)
routerPost.get('/gemini/generate',getgptdata)
module.exports = routerPost;