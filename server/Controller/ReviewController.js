const Review = require('../Model/ReviewModel')
const Post = require('../Model/PostModel')
const ObjectId  = require('mongodb').ObjectId;
const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');
const { default: axios } = require('axios');

const conn = mongoose.createConnection('mongodb://localhost:27017/hardwaredb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  let gfs;
  conn.once('open', () => {
    gfs = new GridFSBucket(conn.db, { bucketName: 'ReviewImage' });
    console.log('GridFS initialized');
    
  });


  const createReview = async (req, res) => {
    const { hotelid, reviewerId, reviewcontent, rating } = req.body;
    console.log(req.body);

    // Correct condition to check for missing inputs
    if (!hotelid || !reviewerId || !reviewcontent || !rating) {
        return res.status(400).json({ message: 'Missing required input values' });
    }

    try {
        const doc = new Review({
            HotelID: hotelid,
            ReviewerID: reviewerId,
            reviewcontent: reviewcontent,
            rating: rating,
        });
        await doc.save();
        return res.status(201).json({
            success: true,
            message: 'Review created successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error creating review',
        });
    }
};

const renderReview = async (req, res) => {
    const { hotelid } = req.query;
    console.log(req.query);

    if (!hotelid) {
        return res.status(400).json('No hotel ID provided');
    }

    try {
        const docs = await Review.find({ HotelID: hotelid });
        const files = await gfs.find().toArray();

        if (docs && docs.length > 0) {
            const formattedReview = await Promise.all(docs.map(async (doc) => {
                const imgArr = files.filter(file => 
                    (file.contentType === 'image/jpeg' || file.contentType === 'image/png') &&
                    file.metadata?.HotelID === doc.HotelID
                ).map(file => `/api/renderReviewImg?imgid=${file._id}`);

                return {
                    rvid:doc._id,
                    HotelID: doc.HotelID,
                    ReviewerID: doc.ReviewerID,
                    reviewcontent: doc.reviewcontent,
                    rating: doc.rating,
                    imgArr: imgArr,
                };
            }));

            console.log(formattedReview);
            return res.json(formattedReview);
        } else {
            return res.status(400).json({ error: 'No reviews found for the specified hotel.' });
        }
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return res.status(500).json({ error: 'Server error, please try again later.' });
    }
};



 const renderReviewIamge = async (req, res) => {
    const { imgid } = req.query;
    console.log(imgid);
    
    
    if (!imgid) {
      return res.status(400).json({ message: 'No image found' });
    }
    
    if (!gfs) {
      return res.status(400).json({ message: 'No GFS' });
    }
    
    try {
   
      const ObjectID = new mongoose.Types.ObjectId(imgid);
      console.log(ObjectID);
    
     
      const files = await gfs.find({ _id: ObjectID }).toArray();
    
      if (!files || files.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No files available',
        });
      }
    
      const file = files[0];
    

      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        res.set('Content-Type', file.contentType);
        
       
        const downloadStream = gfs.openDownloadStream(file._id); 
        downloadStream.pipe(res);
      } else {
        return res.status(400).json({ error: 'File is not an image' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  };
  


  module.exports = {createReview,renderReviewIamge,renderReview}