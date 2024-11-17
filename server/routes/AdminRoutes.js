const express = require('express');
const routerAdmin = express.Router();
const {admingettk,getHotel,
    getOrder,getReview,
deletetk,deletehotel,deleteReview,deleteOrder}  = require('../Controller/AdminController') ;
const { route } = require('./accountRoutes');


routerAdmin.get('/admin/getuser',admingettk)
routerAdmin.post('admin/deleteuser',deletetk)
routerAdmin.get('/admin/gethotel',getHotel)
routerAdmin.post('admin/deletehotel',deletehotel)
routerAdmin.get('/admin/getorder',getOrder)
routerAdmin.post('admin/deleteReview',deleteReview)
routerAdmin.get('/admin/getreview',getReview)
routerAdmin.post('admin/deleteOrder',deleteReview)
module.exports = routerAdmin;