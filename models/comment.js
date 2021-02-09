const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    postedBy: { type: ObjectId, ref: 'User' }
}, {timestamps: true})

module.exports = mongoose.model('Comment', commentSchema);