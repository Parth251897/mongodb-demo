const express = require("express");
const router = express.Router();
const productcontroller= require("../../controller/product/productcontroller");
const {auth, restrict } = require("../../middleware/Auth")

// auth route

router.post('/create-product',auth,restrict("seller"),productcontroller.addProduct)
router.post('/favorite',auth,restrict("user"),productcontroller.productLikeDislike)
router.post('/approve-reject-product',auth,restrict("admin"),productcontroller.approveRejectProduct)
router.post('/search-product',auth,restrict("user"),productcontroller.searchProduct)

router.post('/search',auth,restrict("user"),productcontroller.productSearch)
router.get('/myLikeProduct',auth,restrict("user"),productcontroller.myLikeProduct)
router.get('/allProduct',auth,restrict("user"),productcontroller.allProduct)
router.get('/test',auth,restrict("user"),productcontroller.test)







module.exports = router