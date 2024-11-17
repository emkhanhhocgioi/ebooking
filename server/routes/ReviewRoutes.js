
const express = require('express')
const routerReview = express.Router();
const {createReview,renderReviewIamge,renderReview} = require('../Controller/ReviewController') ;
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');

const storage = new GridFsStorage({
    url: 'mongodb://localhost:27017/hardwaredb',
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const HotelID = req.body.hotelid;
            const ReviewerID = req.body.reviewerId;
            const reviewid =req.body.reviewId;
            if (!HotelID || !ReviewerID ||!reviewid) {
                return reject(new Error('Missing HotelID or ReviewerID'));
            }

            resolve({
                filename: file.originalname,
                bucketName: 'ReviewImage',
                metadata: { 
                    HotelID, 
                    ReviewerID,
                    ReviewId: reviewid
                },
            });
        });
    },
});
  
  const upload = multer({storage,
      limits: { fieldSize: 25 * 1024 * 1024,}, 
  })

  routerReview.post('/createReview', upload.array('file', 2), async (req, res) => {
    
    if (req.files && req.files.length > 2) {
        return res.status(400).send('Chỉ cho phép tối đa 2 tệp hình ảnh');
    }

   
    await createReview(req, res);
});
routerReview.get('/renderReviewImg',renderReviewIamge)
routerReview.get('/renderReview',renderReview)


module.exports = routerReview;