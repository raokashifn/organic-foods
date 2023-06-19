const mongoose = require('mongoose');

const schema = mongoose.Schema({
    date: {
        type: Date,
        default: Date().now,
        // required: true
    },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    description: { type: String, required: true},
    imgSrc: { type: String, required: true },

});

const SellerModal = mongoose.model('Seller', schema);
module.exports = SellerModal;

//signup: take phone number (firebase check is optional!)
// if(user not in firebase)-> -> save it to firebase for auth purposes 
// also save in seller modal
//login:  check if user exists  and authorize using firebase and give session