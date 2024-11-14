const Order =  require('../Model/OrdersModels')
const mongoose = require('mongoose');


const createOrder = async (req, res) => {
    const { UserID, HotelID, checkin, checkout, note } = req.body;
    console.log(req.body);
    console.log(UserID,HotelID,checkin,checkout,note)
   
    if (!UserID || !HotelID || !checkin || !checkout) {
        return res.status(400).json({ message: 'Missing required input values' });
    }

    try {
     
        const document = new Order({
            UserID: UserID,
            HotelID: HotelID,
            Checkindate: new Date(checkin),  
            Checkoutdate: new Date(checkout),  
            Note: note || "", 
            orderStatus: 'Pending',
            orderDay: new Date(),  
        });

       
        await document.save();

        return res.status(201).json({
            success: true,
            message: 'Order created successfully',
        });
    } catch (error) {
      
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error creating order',
        });
    }
};

const getUserOrders = async (req, res) => {
    const { userID } = req.query;
  
    if (!userID) {
      return res.status(400).json({ message: 'No user ID found' });
    }
  
    try {
      const docs = await Order.find({ UserID: userID });
  
      if (docs.length > 0) {
        const formattedDocs = docs.map((doc) => {
          return {
            UserID: doc.UserID,
            HotelID: doc.HotelID,
            Checkindate: doc.Checkindate,
            Checkoutdate: doc.Checkoutdate,
            Note: doc.Note,
            orderDay: doc.orderDay,
            orderStatus: doc.orderStatus,
          };
        });
  
       
        return res.status(200).json(formattedDocs);
      } else {
        return res.status(404).json({ message: 'No orders found for this user' });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  };


module.exports = {createOrder,getUserOrders}