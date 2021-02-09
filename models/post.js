const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: ''
    },
    likes: [{ type: ObjectId, ref: 'User' }],
    comments: [{ type: ObjectId , ref: 'Comment' }],
    postedBy: {
        type: ObjectId,
        ref: 'User'
    }
},{timestamps: true})

module.exports = mongoose.model('Post', postSchema);