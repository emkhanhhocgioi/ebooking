// routes/accountRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');

// MongoDB connection string
const storage = new GridFsStorage({
  url: 'mongodb://localhost:27017/hardwaredb',
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    console.log('File object:', file);
    return {
      filename: file.originalname,
      bucketName: 'uploads', 
   
    };
  },
  error: (error) => {
    console.error('File upload error:', error);
  },
});
const upload = multer({ 
  storage,
  limits: { fieldSize: 25 * 1024 * 1024,}, 
});

const storage2 = new GridFsStorage({
  url: 'mongodb://localhost:27017/hardwaredb',
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file:(req,file)=>{
    console.log('File object:', file);
    return{
      filename:file.originalname,
      bucketName:'Posts',
      metadata:{
        postID:req.body.postID,
      }
    }
  }
})


const { signup, signupHotel, login, getUserData, editProfile, uploadProfile ,getUserProfileImage } = require('../Controller/AccountController');




// POST route for profile upload
router.post('/upload/profile', upload.single('file'), uploadProfile);
router.get('/image',getUserProfileImage)
// Other routes
router.get('/getUserData', getUserData);
router.post('/signup', signup);
router.post('/login', login);


module.exports = router;
