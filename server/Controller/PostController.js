
const Post = require('../Model/PostModel')
const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');
const conn = mongoose.createConnection('mongodb://localhost:27017/hardwaredb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  let gfs;
  conn.once('open', () => {
    gfs = new GridFSBucket(conn.db, { bucketName: 'POSTIMGS' });
    console.log('GridFS initialized');
    
  });
  

const createPost = async(req,res) =>{
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }
    const {PostID,posterID,hotelname,Address,Price,
        city,country,describe,Addon,posterName,
        freewifi,freefood } = req.body;
    console.log(req.body)
    try{
        const existingPostID =  await Post.findOne({PostID:PostID})
        if(!existingPostID){
            const document = await new Post({
            PostID:PostID,
            PosterID:posterID,
            HotelName:hotelname,
            Address:Address,
            price:Price,
            city:city,
            country:country,
            describe:describe,
            addon:Addon,
            Posterimage:posterName,
            rating:0,
            freewifi:freewifi,
            freeFood:freefood
        }
        );
        await document.save();
        return res.status(201).json({
            success: true,
            message: 'Account created successfully',
        });
        }else{
            return res.status(400).json({
                success: false,
                message: 'Post with this ID already exists',
            });
        }
       
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while creating the post',
        });
    }

}
const fecthUserPost = async (req, res) => {
    const { userID } = req.query;
    const imgarr = [];

    if (!userID) {
        console.log('No user ID');
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const document = await Post.findOne({ PosterID: userID });
        
        if (document) {
            const files = await gfs.find().toArray();

            
            const imagePromises = files
                .filter(file => file.metadata && file.metadata.UID === userID)
                .filter(file => file.contentType === 'image/jpeg' || file.contentType === 'image/png')
                .forEach(file => {

                    imgarr.push(`/api/getpostimg?imgname=${file.filename}`);
                   
                   
                });
            const formattedDocument = {
                PostID: document.PostID,
                HotelName: document.HotelName,
                Address: document.Address,
                price: document.price,
                city: document.city,
                country: document.country,
                describe: document.describe,
                addon: document.addon,
                rating: document.rating,
                freewifi: document.freewifi,
                freefood: document.freeFood,
            };

            res.json({ post: formattedDocument, images: imgarr });
        } else {
            res.status(404).json({ error: 'Post not found' });
        }

    } catch (error) {
        console.error('Error fetching user post:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
    
};
const fecthAllPost = async (req, res) => {
   
    
    try {
      
        const posts = await Post.aggregate([{ $sample: { size: 10 } }]);

       
       
        const files = await gfs.find().toArray();

        const imgarr = files.filter(file => file.contentType === 'image/jpeg' || file.contentType === 'image/png')
            .map(file => `/api/getpostimg?imgname=${file.filename}`);  

      
        const formattedPosts = posts.map(post => ({
            PostID: post.PostID,
            HotelName: post.HotelName,
            Address: post.Address,
            price: post.price,
            city: post.city,
            country: post.country,
            describe: post.describe,
            addon: post.addon,
            rating: post.rating,
            freewifi: post.freewifi,
            freefood: post.freeFood,
            imgArr: imgarr,
        }));

        console.log(formattedPosts)
        console.log(imgarr)
        res.json({
            posts:formattedPosts
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};
const renderPostImage = async(req,res) =>{
    const { imgname } = req.query;
    console.log(imgname);
  
    if (!imgname) {
      return res.status(400).json({ message: 'No image found' });
    }
  
    if (!gfs) {
      return res.status(400).json({ message: 'No GFS' });
    }
  
    try {
      const files = await gfs.find({ filename: imgname }).toArray();
  
      if (!files || files.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No files available',
        });
      }
  
      const file = files[0];
  
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        res.set('Content-Type', file.contentType);
        const downloadStream = gfs.openDownloadStreamByName(imgname);  // Corrected here
        downloadStream.pipe(res);
      } else {
        return res.status(400).json({ error: 'File is not an image' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

module.exports  = {createPost,fecthUserPost,fecthAllPost,renderPostImage}