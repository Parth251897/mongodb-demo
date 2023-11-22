const { default: mongoose } = require("mongoose");
const FavoriteProduct = require("../../models/products/favoriteProduct");
const Product = require("../../models/products/product");
const User = require('../../models/user/User');
const { StatusCodes } = require("http-status-codes");
const {
    handleError,
    sendResponse,
    validatePassword,
    passwordencrypt,
  } = require("../../services/Commonservice");
const randomstring = require("randomstring");
const ResponseMessage = require("../../utils/Responsemessage.json");

// access for seller
exports.addProduct = async(req,res)=>{
    try {
        const {productName,category,description,date,price } = req.body;
        const productcode = randomstring.generate(
            {length: 16,
            charset:'numeric'}
        );
        const sellerId = req.role.id;

        const isExistsProductName = await Product.findOne({productcode});
        if(isExistsProductName){
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                ResponseMessage.PRODUCT_ALREDY_EXIT
              );
        }
        const productData = new Product({
            sellerId,
            productcode,
            productName,
            description,
            category,
            date,
            price
        });
        productData.save().then((result)=>{
            const message = ResponseMessage.PRODUCT_ADED;
            return sendResponse(res, StatusCodes.CREATED, message, productData);
        }).catch((err)=>{
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                ResponseMessage.PRODUCT_NOT_ADD
              );
        })
    } catch (error) {
        return handleError(res, error);
    }
}

// access for user

exports.productLikeDislike = (req,res)=>{
    try {
        const userId = req.role.id;
        const { productId, isLike } = req.body;
        FavoriteProduct.findOneAndUpdate(
            { userId, productId },
            { isLike },
            { new: true, upsert: true }
        )
        .then((result) => {
            let message = isLike ? "Product Liked" : "Product Disliked";
            return sendResponse(res, StatusCodes.CREATED, message, result);
        })
        .catch((err) => {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                ResponseMessage.TRYAGAIN
              );
        });
    } catch (error) {
        return handleError(res, error);
    }
}

// list of like product by user
exports.myLikeProduct = async (req, res) => {
    try {
        const userId = req.role.id;
        const favoriteProducts = await FavoriteProduct.find({ userId: userId, isLike: true}).
        populate('userId','name').
        populate('productId');

        const message = ResponseMessage.LIKED_PRODUCTS
        return sendResponse(res, StatusCodes.OK, message, favoriteProducts);
    } catch (error) {
        return handleError(res, error);
    }
};

//get all product
exports.allProduct = async(req,res)=>{
    try {
        const userId = req.role.id
        const getAllProduct = await Product.find({ 
            isDelete:false
        }).sort({ createdAt: -1 })
        const promises = getAllProduct.map(async (product) => {
            const likeProduct = await FavoriteProduct.findOne({ userId, productId: product.id });
           
            const productWithLikeStatus = {
              ...product.toObject(),
              isLike: likeProduct ? true : false,
            };
            return productWithLikeStatus;
        });
       const productsWithLikeStatus  = await Promise.all(promises);

       const message = ResponseMessage.ALL_PRODUCTS
       return sendResponse(res, StatusCodes.OK, message, productsWithLikeStatus);
    } catch (error) {
        return handleError(res, error);
    }
}

// product approve
exports.approveRejectProduct = (req,res)=>{
    try {
        const { status,productId } = req.body;
        Product.findByIdAndUpdate(
            { _id:productId},
            { $set: {status} },
            { new: true }
        ).then((result)=>{
            const  message = `Status ${status} Successfully`
            return sendResponse(res, StatusCodes.OK, message, result);
        })
    } catch (error) {
        return handleError(res, error);
    }
}

//search product
exports.productSearch = async(req,res)=>{
    try {
        const category = req.body;
       
        const products = await Product.find(category);
    
    } catch (error) {
        return handleError(res, error);
    }
}

//regex demo product search
exports.searchProduct= async(req, res)=> {
    const search = req.query.q;
  
    if (!search) {
        const message = "Search details are required"
        return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            message
          );
    }
  
    try {
      const regex = new RegExp(search, "i");
  
      const results = await Product.find({
        $or: [
          { productcode: regex },
          { productName: regex },
          { category: regex },
          { price: regex },
          { sellerId: regex },
        ],
      });
      const message = "Search details find successfully"

      return sendResponse(res, StatusCodes.OK, message, results);
    } catch (error) {
        return handleError(res, error);
    }
  }

//aggregations demo
exports.test = async(req,res)=>{
    try {
        const userId = req.role.id;
    
        const productLikeStatus = await Product.aggregate([
          {
            $match: {
              isDelete: false,
              status: "Approved",
            },
          },
          {
            $lookup: {
              from: "Favorite",
              let: { productId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                        { $eq: ["$productId", "$$productId"] },
                      ],
                    },
                  },
                },
              ],
              as: "likeProduct",
            },
          },
          {
            $addFields: {
              isLike: {
                $gt: [{ $size: "$likeProduct" }, 0],
              },
            },
          },
          {
            $project: {
              likeProduct: 0,
            },
          },
        ]);
    
        const message =  "Get data successfully"
        return sendResponse(res, StatusCodes.OK, message, productLikeStatus);
      } catch (error) {
        return handleError(res, error);
      }
    
}
