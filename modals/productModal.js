const mongoose = require('mongoose');

const schema = mongoose.Schema({
    date: {
        type: Date,
        default: Date().now,
        // required: true
    },
    // user: {type:mongoose.Types.ObjectId},
    name: { type: String, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller'
      },
    price: { type: Number, required: true },
    bulkQty: { type: String, required: true },
    description: { type: String, default: '' },
    imgSrc: { type: String, default: '' },
    sellerName: {
        type:String, required:true
    },
    sellerId: {
        type:String,
        required:true
    }
});

const ProductModal = mongoose.model('Product', schema);
module.exports = ProductModal;