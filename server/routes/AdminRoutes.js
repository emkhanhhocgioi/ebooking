const express = require('express');
const routerAdmin = express.Router();
const {admingettk,getHotel,
    getOrder,getReview,
deletetk,deletehotel,deleteReview,deleteOrder,
createDestination,renderDestinationImg,renderDestination}  = require('../Controller/AdminController') ;


const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');

const storage = new GridFsStorage({
    url: 'mongodb://localhost:27017/hardwaredb',
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            resolve({
                filename: file.originalname,
                bucketName: 'destination',
                
            });
        });
    },
});
  
  const upload = multer({storage,
      limits: { fieldSize: 25 * 1024 * 1024,}, 
  })



routerAdmin.post('/admin/createdestination',upload.single('file'),createDestination)
routerAdmin.get('/admin/getuser',admingettk)
routerAdmin.get('/getDestination',renderDestination)
routerAdmin.get('/images/getdestimg',renderDestinationImg)
routerAdmin.post('/admin/deleteuser',deletetk)
routerAdmin.get('/admin/gethotel',getHotel)
routerAdmin.post('/admin/deletehotel',deletehotel)
routerAdmin.get('/admin/getorder',getOrder)
routerAdmin.post('/admin/deleteOrder',deleteOrder)
routerAdmin.get('/admin/getreview',getReview)
routerAdmin.post('/admin/deleteReview',deleteReview)

module.exports = routerAdmin;