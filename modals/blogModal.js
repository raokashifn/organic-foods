const mongoose = require('mongoose');

const schema = mongoose.Schema({
    date: {
        type: Date,
        default: Date().now,
        // required: true
    },
    title: { type: String, required: true },
    intro_text: { type: String, required: true },
    description: { type: String, required: true},
    imgSrc: { type: String, required:true },

});

const BlogModal = mongoose.model('Blog', schema);
module.exports = BlogModal;