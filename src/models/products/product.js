const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    sellerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    productcode: {
      type: String,
      required: false,
    },

    productName: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    date: {
      type: String,
      required: false,
    },
    reviews: {
      type: String,
      required: false,
    },
    price: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Reject", "Approved"],
      default: "Pending",
      required: false,
    },
    isDelete: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Product = new mongoose.model("product", productSchema);
module.exports = Product;
