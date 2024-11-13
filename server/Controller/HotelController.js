
const Hotel = require('../Model/HotelModels');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');


const conn = mongoose.createConnection('mongodb://localhost:27017/hardwaredb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;
conn.once('open', () => {
  gfs = new GridFSBucket(conn.db, { bucketName: 'Hotels' });
  console.log('GridFS initialized');
 
});


const NewPartner = async (req, res) =>{
    const {name,gmail,password,host,phonenmber} = req.body;
    const missingFields = [];

  
    if (!name) missingFields.push('name');
    if (!gmail) missingFields.push('gmail');
    if (!password) missingFields.push('password');
    if (!host) missingFields.push('host');
    if (!phonenmber) missingFields.push('phonenmber');

   
    if (missingFields.length > 0) {
        return res.status(400).json({
            error: 'Missing required fields',
            missingFields: missingFields
        });
    }
    try {
        const document = await new Hotel({
            HotelName: name,
            Gmail: gmail,
            Password: password,
            location:' ',
            description:' ',
            amenities:' ',
            price_per_night:' ',
            host:host,
            phonenumber:phonenmber
           
        })
        const respone = await document.save()
        
    } catch (error) {
        
    }
}
