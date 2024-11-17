
const express = require('express');
const routerPost = express.Router();
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const { route } = require('./accountRoutes');

const {createPost,fecthUserPost, fecthAllPost,
   renderPostImage
  ,countrating} = require('../Controller/PostController')
// MongoDB connection string

const storage = new GridFsStorage({
  url: 'mongodb://localhost:27017/hardwaredb',
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  
  file:(req,file)=>{
    
    const postID = req.body.PostID;
    const userID = req.body.posterID;
    if (!postID) {
      throw new Error('postID is missing');
    }
    console.log(postID)
 
    return{
      filename:file.originalname,
      bucketName:'POSTIMGS',
      metadata:{
        postID: postID,
        UID: userID,
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
module.exports = routerPost;