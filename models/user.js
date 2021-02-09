const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        default: "https://res.cloudinary.com/darkslasher/image/upload/v1611470427/noimage_nyazln.png"
    },
    bio: {
        type: String,
        default: ''
    },
    followers: [{ type: ObjectId , ref: 'User' }],
    following: [{ type: ObjectId , ref: 'User' }]
})


module.exports = mongoose.model('User', userSchema);