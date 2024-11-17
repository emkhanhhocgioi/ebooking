

const express = require('express');
const router = express.Router();
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');


const storage = new GridFsStorage({
  url: 'mongodb://localhost:27017/hardwaredb',
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      console.log('File object:', file);
      const userid = req.body.uid;
      if (!userid) {
        return reject(new Error('Missing UserID'));
      }
      resolve({
        filename: file.originalname,
        bucketName: 'uploads',
        metadata: { userid: userid },
      });
    });
  },
  error: (error) => {
    console.error('File upload error:', error);
  },
});


const upload = multer({ 
  storage,
  limits: { fieldSize: 25 * 1024 * 1024,}, 
});



const { signup, login, getUserData, signupPartner, uploadProfile ,getUserProfileImage } = require('../Controller/AccountController');




// POST route for profile upload
router.post('/upload/profile', upload.single('file'), uploadProfile);
router.get('/image',getUserProfileImage)
// Other routes
router.get('/getUserData', getUserData);
router.post('/signup', signup);
router.post('/signupPartner', signupPartner);
router.post('/login', login);


module.exports = router;
