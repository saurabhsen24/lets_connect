const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');

exports.getUser = (req, res) => {
    User.findOne({_id: req.params.userId })
    .select('-password')
    .then(user => {
        Post.find({postedBy: req.params.userId})
        .populate('postedBy','_id name pic')
        .populate({
            path: 'comments',
            select: '_id text postedby',
            model: 'Comment',
            populate: {
                path: 'postedBy',
                select: '_id name',
                model: 'User'
            }
        })
        .exec((err, posts) => {
            if(err){
                return res.status(422).json({error: err})
            }
            res.json({user,posts})
        })
    })
    .catch(err => res.status(404).json({error: 'User not found'}))
}

exports.followUser = (req, res) => {
    const { followId } = req.body;
    User.findByIdAndUpdate(req.user._id, {
        $push: { following: followId }
    },{
        new: true
    }, (err, result) => {
        if(err){
            return res.status(422).json({error: err})
        }

        User.findByIdAndUpdate(followId, {
            $push: { followers: req.user._id }
        },{
            new: true
        })
        .then(result => {
            res.json(result)
        })
        .catch(err => console.log(err))
    })
}

exports.unfollowUser = (req, res) => {
    const { unfollowId } = req.body;
    User.findByIdAndUpdate(req.user._id, {
        $pull: { following: unfollowId }
    },{
        new: true
    }, (err, result) => {
        if(err){
            return res.status(422).json({error: err})
        }

        User.findByIdAndUpdate(unfollowId, {
            $pull: { followers: req.user._id }
        },{
            new: true
        })
        .then(result => {
            res.json(result)
        })
        .catch(err => console.log(err))
    })    
}

exports.uploadPic = (req , res) => {
    const { pic } = req.body;
    User.findByIdAndUpdate(req.user._id, {
        pic
    },{
        new: true
    }, (err, user) => {
        if(err){
            return res.status(422).json({error: err})
        }

        res.json(user)
    })
}


exports.updateUser = (req, res) => {
    const { name, email , oldPassword , newPassword , bio } = req.body;
    
    if(oldPassword && newPassword){
        if(!email || !oldPassword){
            return res.status(401).json({
                error: "Invalid email or password"
            })
        }
    
        User.findOne({email: email})
        .then(savedUser => {
            if(!savedUser){
                return res.status(401).json({
                    error: "Invalid email or password"
                })
            }
    
            bcrypt.compare(oldPassword, savedUser.password)
            .then(doMatch => {
                if(doMatch){
                    const token = jwt.sign({_id: savedUser._id}, process.env.TOKEN_SECRET);
                    bcrypt.hash(newPassword, 12)
                    .then(hashedPassword => {
                        savedUser.password = hashedPassword
                        savedUser.name = name
                        savedUser.bio = bio
                        savedUser.email = email

                        savedUser.save()
                        .then(updatedUser => {
                            const { _id, name , email, bio } = updatedUser
                            return res.status(200).json({
                                message: 'Successfully updated profile',
                                user: { _id , name , email , bio },
                                token
                            })
                        })
                        .catch(err => res.json({error: `Failed to update,  ${err}`}))
                    })
                    .catch(err => console.log(err))

                }else{
                    return res.status(401).json({
                        error: 'Invalid email or password'
                    })
                }
            })
        })
        .catch(err => console.log(err))
    }else{
        User.findByIdAndUpdate(req.user._id, {
            name, 
            email,
            bio
        },{
            new: true
        }, (err, updatedUser) => {
            if(err){
                return res.status(422).json({error: err})
            }
    
            const { _id, name , email, bio } = updatedUser
    
            res.json({
                message: 'Successfully updated Profile',
                user: { _id , name , email , bio }
            })
        })
    }
}


exports.searchUser = (req, res) => {
    let userPattern = new RegExp(`^${req.body.query}`)
    User.find({email: {$regex: userPattern}})
    .select("_id email")
    .then(users => {
        res.json({users})
    })
    .catch(err => console.log(err))
}

exports.deleteUserAccount = (req, res) => {
    const { userId } = req.params;

    User.findByIdAndDelete(userId, (err , user) => {
        if(err || !user){
            return res.status(422).json({error: err})
        }
        
        Post.updateMany({likes: {$in: userId}}, { $pull: { likes: userId} })
        .then(results => {
            User.updateMany({followers: {$in: userId}}, { $pull: {followers: {$in: userId}}})
            .then(results => {
                console.log('following ', results)
                User.updateMany({following: {$in: userId}},{ $pull: {following: {$in: userId}}})
                .then(results => {
                    Comment.deleteMany({postedBy: userId})
                    .then(comments => {
                        res.json({user, comments})
                    })
                    .catch(err => console.log("comments error ",err))
                })
                .catch(err => console.log('following error ',err))
            })
            .catch(err => console.log('followers error ',err))
        })
        .catch(err => console.log('likes error ', err))
    })
}