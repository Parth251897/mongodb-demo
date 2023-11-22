const express = require('express');
const router = express.Router();
const cart = require('../../controller/product/cartcontroller');
const {auth, restrict } = require("../../middleware/Auth")

router.post('/add-to-cart', auth,restrict("user"),cart.addToCart);
router.get('/get-cart', auth,restrict("user"),cart.getCart);
router.get('/get-all-cart', auth,restrict("seller"),cart.getAllCart);



module.exports = router;