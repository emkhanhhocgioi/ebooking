
const express = require('express')
const routerOrder = express.Router();

const {createOrder,getUserOrders} = require('../Controller/OrdersController');



routerOrder.post('/createorder',createOrder)
routerOrder.get('/getbooked',getUserOrders)

module.exports = routerOrder;