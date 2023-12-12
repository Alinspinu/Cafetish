const express = require('express');
const router = express.Router();
const apiRoutes = require('../controlers/true-orders')


router.route('/recive-order').get(apiRoutes.sendLiveOrders)
router.route('/get-order').get(apiRoutes.getOrder)
router.route('/order-done').get(apiRoutes.orderDone)
router.route('/order-page').get(apiRoutes.renderTrueOrders)
router.route('/finish-order-page').get(apiRoutes.renderTrueOrdesTerminat)
router.route('/set-order-time').get(apiRoutes.setOrderTime)
router.route('/get-order-done').get(apiRoutes.getOrderDone)
router.route('/get-cake-orders').get(apiRoutes.getCakeOrders);
router.route('/cake-orders').get(apiRoutes.renderCakeOrders)
router.route('/set-delivered').get(apiRoutes.setDelivered)


module.exports = router