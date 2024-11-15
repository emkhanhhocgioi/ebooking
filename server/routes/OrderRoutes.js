
const express = require('express')
const routerOrder = express.Router();

const {createOrder,getUserOrders,AcceptOrders,DeniedOrders,getCustomerAcceptOrder} = require('../Controller/OrdersController');



routerOrder.post('/createorder',createOrder)
routerOrder.get('/getbooked',getUserOrders)
routerOrder.post('/accpetOrder',AcceptOrders)
routerOrder.post('/deniedOrder',DeniedOrders)
routerOrder.get('/getSchedule',getCustomerAcceptOrder)
module.exports = routerOrder;