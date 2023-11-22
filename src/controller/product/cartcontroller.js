const Cart = require("../../models/products/cart");
const Product = require("../../models/products/product");
const User = require("../../models/user/User");
const { StatusCodes } = require("http-status-codes");
const {
    handleError,
    sendResponse,
    validatePassword,
    passwordencrypt,
  } = require("../../services/Commonservice");

const ResponseMessage = require("../../utils/Responsemessage.json");

exports.addToCart = async (req, res) => {
  try {
    const userId = req.role.id;
    const { productId, quantity, price, type } = req.body;
    let cart = await Cart.findOne({ userId });
    if (cart) {
      let existingProduct = cart.products.findIndex(
        (p) => p.productId == productId
      );
      console.log(existingProduct);
      if (existingProduct > -1) {
        if (type === "+") {
          cart.products[existingProduct].quantity += quantity;
          cart.products[existingProduct].price += price;
          cart.totalAmount += price * quantity;
        } else if (type === "-") {
          cart.products[existingProduct].quantity -= quantity;
          cart.products[existingProduct].price -= price;
          cart.totalAmount -= price * quantity;
        } else {
          cart.products[existingProduct].quantity += quantity;
          cart.products[existingProduct].price += price;
          cart.totalAmount += price * quantity;
        }
      } else {
        cart.products.push({ productId, quantity, price });
        cart.totalAmount += price * quantity;
      }
      cart = await cart.save();
      const message = "Cart updated successfully";
      return sendResponse(res, StatusCodes.OK, message, cart);
    } else {
      const newCart = await Cart.create({
        userId,
        products: [{productId, quantity, price }],
        totalAmount: price * quantity,
      });
      const message = "Cart added successfully";
      return sendResponse(res, StatusCodes.OK, message, newCart);
    }
  } catch (error) {
    return handleError(res, error);
  }
};

//get loginguser cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.role.id;
    const getuserCart = await Cart.find({userId})
      .populate("products.productId")
      .populate("userId", "name");

      const message = "Cart get successfully";
      return sendResponse(res, StatusCodes.OK, message, getuserCart);
  } catch (error) {
    return handleError(res, error);
  }
};

//get all cart by seller
exports.getAllCart = async (req, res) => {
    try {
      const sellerId = req.role.id;
      const getAllCart = await Cart.find({})
        .populate("products.productId")
        .populate("userId", "name");
  
      const message = "Cart get successfully";
      return sendResponse(res, StatusCodes.OK, message, getAllCart);
    } catch (error) {
      return handleError(res, error);
    }
  };
  

