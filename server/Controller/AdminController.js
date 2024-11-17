const taikhoan = require('../Model/accounts');
const Order =  require('../Model/OrdersModels')
const Review = require('../Model/ReviewModel')
const Post = require('../Model/PostModel');
const Taikhoan = require('../Model/accounts');
const { post } = require('../routes/accountRoutes');


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

module.exports ={admingettk,deletetk,getHotel,deletehotel,getOrder,getReview,deleteReview,deleteOrder}