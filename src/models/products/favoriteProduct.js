const mongoose = require('mongoose');

const FavoriteProductSchema = mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        isLike:{
            type: Boolean,
            required: true
        },

        likeCount: {
            type: Number,
            default: 0,
        },
        dislikeCount: {
            type: Number,
            default: 0,
        },
    },
    {
        versionKey: false,
        timestamps: true
    }
);


const FavoriteProduct = mongoose.model('productfavorite',FavoriteProductSchema);
module.exports = FavoriteProduct;