const taikhoan = require('../Model/accounts');
const Order =  require('../Model/OrdersModels')
const Review = require('../Model/ReviewModel')
const Post = require('../Model/PostModel');
const Taikhoan = require('../Model/accounts');
const Dest = require('../Model/Destination');
const mongoose =require('mongoose')
const { GridFSBucket } = require('mongodb');
const conn = mongoose.createConnection('mongodb://localhost:27017/hardwaredb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  let gfs;
  conn.once('open', () => {
    gfs = new GridFSBucket(conn.db, { bucketName: 'destination' });
    console.log('GridFS initialized');
    
  });


const admingettk = async (req,res) => {
    try {
        const docs  = await taikhoan.find({urole: 
            {$in: [1,2]}})
        const rtndoc = docs.map(doc => ({
            id:doc._id,
            Username: doc.Username,
            Email:doc.Email,
            PhoneNumber:doc.PhoneNumber,
            urole:doc.urole,
        }));
        res.json(rtndoc)
    } catch (error) {
        console.log(error)
    }
}
const deletetk = async (req, res) => {
    const { id } = req.query;

    try {

        const doc = await taikhoan.findByIdAndDelete(id);
        if (doc) {

            return res.status(200).json({ message: "Tài khoản đã được xóa thành công.", data: doc });
        } else {

            return res.status(404).json({ message: "Không tìm thấy tài khoản với ID này." });
        }
    } catch (err) {
     
        console.error(err);
        return res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình xóa.", error: err.message });
    }
};

const getHotel = async (req, res) => {
    try {
     
        const docs = await Post.find({});

        
        const rtndoc = docs.map(doc => ({
            PostID: doc.PostID,
            PosterID: doc.PosterID,
            HotelName: doc.HotelName,
            Address: doc.Address,
            price: doc.price,
            city: doc.city,
            country: doc.country,
        }));

       
        const documentHotel = await Promise.all(
            rtndoc.map(async (doc) => {
                
                const tkdoc = await Taikhoan.findOne({ _id: doc.PosterID });

                if (!tkdoc) {
                    return {
                        ...doc,
                        tkdetails: null,
                    };
                }

                return {
                    ...doc,
                    tkdetails: {
                        id: tkdoc._id,
                        Username: tkdoc.Username,
                    },
                };
            })
        );

      
        res.status(200).json(documentHotel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi lấy dữ liệu.", error: error.message });
    }
};
const deletehotel = async (req, res) => {
    const { id } = req.query;

    try {

        const doc = await Post.findByIdAndDelete(id);
        if (doc) {

            return res.status(200).json({ message: "Tài khoản đã được xóa thành công.", data: doc });
        } else {

            return res.status(404).json({ message: "Không tìm thấy tài khoản với ID này." });
        }
    } catch (err) {
     
        console.error(err);
        return res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình xóa.", error: err.message });
    }
};

const getOrder = async (req,res) =>{
    try {
        const docs  = await Order.find({})
        const rtndoc = docs.map(doc => ({
            id:doc._id,
            Customerid: doc.UserID,
            Hotelid:doc.HotelID,
            Checkindate:doc.Checkindate,
            Checkoutdate:doc.Checkoutdate,
            orderDay:doc.orderDay,
            orderStatus:doc.orderStatus,
        }));
        res.json(rtndoc)
    } catch (error) {
        console.log(error)
    }
}
const deleteOrder = async (req, res) => {
    const { id } = req.query;

    try {

        const doc = await Order.findByIdAndDelete(id);
        if (doc) {

            return res.status(200).json({ message: "Tài khoản đã được xóa thành công.", data: doc });
        } else {

            return res.status(404).json({ message: "Không tìm thấy tài khoản với ID này." });
        }
    } catch (err) {
     
        console.error(err);
        return res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình xóa.", error: err.message });
    }
};

const getReview = async(req,res) =>{
    try {
        const docs  = await Review.find({})
        const rtndoc = docs.map(doc => ({
            id:doc._id,
            ReviewID: doc.ReviewID,
            HotelID:doc.HotelID,
            ReviewerID:doc.ReviewerID,
            reviewcontent:doc.reviewcontent,
            orderDay:doc.orderDay,
            orderStatus:doc.orderStatus,
        }));
        res.json(rtndoc)
    } catch (error) {
        console.log(error)
    }
}
const deleteReview = async (req, res) => {
    const { id } = req.query;

    try {

        const doc = await Order.findByIdAndDelete(id);
        if (doc) {

            return res.status(200).json({ message: "Tài khoản đã được xóa thành công.", data: doc });
        } else {

            return res.status(404).json({ message: "Không tìm thấy tài khoản với ID này." });
        }
    } catch (err) {
     
        console.error(err);
        return res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình xóa.", error: err.message });
    }
};
const createDestination = async(req,res) =>{
    const {DestinationName,DestinationDesc} = req.body;

    if(!DestinationName){
        res.status(400).json('no desc')
        return;

    }
    if(!DestinationDesc){
        res.status(400).json('no desc')
        return;
    }
    if (!req.file || !req.file.id) {
        return res.status(400).json({ error: 'Missing file or file id' });
    }
    console.log(DestinationName,DestinationDesc)
    try {
        const doc = new Dest({
            DestinationName:DestinationName,
            DestinationDesc:DestinationDesc,
            Destinationimg:req.file.id,
     
        })
        await doc.save();
        res.status(200).json('create destination success')
    } catch (error) {
        res.status(500).json(error)
    }
   
}
const renderDestination = async (req, res) => {
    try {
  
      const docs = await Dest.find({});
  
   
      const formatdocs = docs.map(doc => ({
        id:doc._id,
        destname: doc.DestinationName,
        desc: doc.DestinationDesc,
        img: `/api/images/getdestimg?imgid=${doc.Destinationimg}`,
      }));
  

      res.json(formatdocs);
    } catch (error) {
  
      res.status(500).json({ error: error.message });
    }
  };
const renderDestinationImg = async (req,res) =>{
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
module.exports ={admingettk,deletetk,
    getHotel,deletehotel,
    getOrder,getReview,
    deleteReview,deleteOrder,
    createDestination,
    renderDestinationImg,renderDestination}