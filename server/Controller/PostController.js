
const Post = require('../Model/PostModel')
const Review = require('../Model/ReviewModel')
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

    if (!userID) {
        console.log('No user ID');
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const documents = await Post.find({ PosterID: userID });
     
        if (documents.length > 0) {
            const files = await gfs.find().toArray();

            const formattedDocuments = await Promise.all(documents.map(async doc => {
                const imgarr = files
                    .filter(file => file.metadata && file.metadata.postID === doc.PostID)
                    .filter(file => file.contentType === 'image/jpeg' || file.contentType === 'image/png')
                    .map(file => `/api/getpostimg?imgid=${file._id}`);

                return {
                    PostID: doc.PostID,
                    HotelName: doc.HotelName,
                    Address: doc.Address,
                    price: doc.price,
                    city: doc.city,
                    country: doc.country,
                    describe: doc.describe,
                    addon: doc.addon,
                    rating: doc.rating,
                    images: imgarr
                };
            }));
            
            res.json({ post: formattedDocuments });
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

        

      
            const formattedPosts = await Promise.all(posts.map(async (post) => {
                // Filter files related to the current post's PostID
                const imgarr = files.filter(file => 
                    (file.contentType === 'image/jpeg' || file.contentType === 'image/png') &&
                    file.metadata?.postID === post.PostID
                ).map(file => `/api/getpostimg?imgid=${file._id}`);
    
                return {
                    PostID: post.PostID,
                    PosterID:post.PosterID,
                    HotelName: post.HotelName,
                    Address: post.Address,
                    price: post.price,
                    city: post.city,
                    country: post.country,
                    describe: post.describe,
                    addon: post.addon,
                    rating: post.rating,
                    imgArr: imgarr,
                };
            }));

        
        res.json({
            posts:formattedPosts
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};
const renderPostImage = async(req,res) =>{
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
}

const countrating  = async(req,res) =>{
    const {postid} = req.query;
    
    try {
        
        const ratings = await Review.find({ HotelID: postid });

        if (ratings.length > 0) {
         
            const totalRating = ratings.reduce((sum, rate) => sum + rate.rating, 0);
            const averageRating = totalRating / ratings.length;

            console.log(`Average rating: ${averageRating}`);
            res.json(averageRating)
        } else {
            console.log("No ratings found for this hotel.");
}
      
      

    } catch (error) {
        
        
    }
}

const sortingPost = async (req, res) => {
    const { postSelectedValue, selectedvldata } = req.body;
  
    // Validate input
    if (!postSelectedValue || !selectedvldata) {
      return res.status(400).json({ error: "Invalid request parameters." });
    }
  
    // Logging inputs for debugging
    console.log(postSelectedValue);
    console.log(selectedvldata);
  
    try {
    
      const docs = await Promise.all(
        postSelectedValue.map(async (vl) => {
          const documents = await Promise.all(
            selectedvldata.map(async (data) => {
       
              const result = await Post.find({ [vl]: data });
              const files = await gfs.find({}).toArray();
              const formattedDocuments = result.map((rs) => {
               
                let imgarr = files
                  .filter(
                    (file) =>
                      (file.contentType === "image/jpeg" ||
                        file.contentType === "image/png") &&
                      file.metadata?.postID === rs.PostID
                  )
                  .map((file) => `/api/getpostimg?imgid=${file._id}`);
  
                return {
                  PostID: rs.PostID,
                  PosterID: rs.PosterID,
                  HotelName: rs.HotelName,
                  Address: rs.Address,
                  price: rs.price,
                  city: rs.city,
                  country: rs.country,
                  describe: rs.describe,
                  addon: rs.addon,
                  rating: rs.rating,
                  imgArr: imgarr,
                };
              });
              return formattedDocuments; 
            })
          );
  
          return documents.flat(); 
        })
      );
  
      // Flatten the final result
      const flatendocs = docs.flat(); 
      console.log(flatendocs);
      res.json(flatendocs); 
  
    } catch (error) {
     
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
  
  const updatePost = async (req, res) => {
    const { PostID, HotelName, Address, price, city, country, describe, addon } = req.body;
  
    // Kiểm tra dữ liệu yêu cầu
    if (!PostID || !HotelName || !Address || !price || !city || !country || !describe || !addon) {
      return res.status(400).json('Missing required data'); 
    }
  
    console.log(req.body);
  
    try {
   
      const docs = await Post.findOneAndUpdate(
        { PostID: PostID }, 
        {
          $set: {
            HotelName: HotelName,
            Address: Address,
            price: price,
            city: city,
            country: country,
            describe: describe,
            addon: addon,
          },
        },
        { new: true } 
      );
  
     
      if (!docs) {
        return res.status(400).json({ message: 'No hotel found' });
      }
  
      return res.status(200).json({ message: 'Data update successful', hotel: docs });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error updating hotel data"); // Dùng return để kết thúc hàm
    }
  };
  
const deleteExistPostimg = async (req, res) => {
  const { postid } = req.body;
  console.log(postid)

  if (!postid) {
    return res.status(400).json({ error: 'Missing postid' });
  }

  try {

    const files = await gfs.find({}).toArray();

    const imgarr = files.filter(
      file =>
        (file.contentType === 'image/jpeg' || file.contentType === 'image/png') &&
        file.metadata?.postID === postid
    );

  
    if (imgarr.length === 0) {
      return res.status(200).json({ message: 'No images found for the given postid' });
    }

    for (const img of imgarr) {
      await gfs.delete(new mongoose.Types.ObjectId(img._id));
    }

    return res.status(200).json({ message: 'Images deleted successfully' });
  } catch (error) {
    console.error('Error deleting images:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports  = {createPost,fecthUserPost,
    fecthAllPost,renderPostImage,
    countrating,
    sortingPost,updatePost,deleteExistPostimg}