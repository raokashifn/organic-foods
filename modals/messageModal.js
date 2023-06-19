const mongoose = require('mongoose');

const schema = mongoose.Schema({
    date: {
        type: Date,
        default: Date().now,
        // required: true
    },
    email: { type: String, },
    name: { type: String, },
    message: { type: String,required:true },
    
});

const MessageModal = mongoose.model('Message', schema);
module.exports = MessageModal;