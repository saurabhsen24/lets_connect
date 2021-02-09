const Post = require('../models/post');
const Comment = require('../models/comment');

exports.getAllPost = (req, res) => {
    Post.find({})
    .populate("postedBy", "_id name pic")
    .populate({
        path: 'comments',
        select: '_id text postedby createdAt',
        model: 'Comment',
        populate: {
            path: 'postedBy',
            select: '_id name',
            model: 'User'
        }
    })
    .sort('-createdAt')
    .then(posts => {
        posts.map(post => {
            post.comments.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
        })

        return res.status(200).json({posts})
    })
    .catch(err => console.log(err))
}

exports.getMySubscribedPost = (req, res) => {
    Post.find({postedBy: {$in: req.user.following}})
    .populate("postedBy","_id name pic")
    .populate({
        path: 'comments',
        select: '_id text postedby createdAt',
        model: 'Comment',
        populate: {
            path: 'postedBy',
            select: '_id name',
            model: 'User'
        }
    })
    .sort('-createdAt')
    .then(posts => {
        posts.map(post => {
            post.comments.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
        })

        return res.status(200).json({posts})
    })
    .catch(err => console.log(err))
}


exports.createPost = (req, res) => {
    console.log(req.body)
    const { title , content , photo } = req.body;
    if(!title || !content){
        return res.status(422).json({error: 'Fields are empty'})
    } 

    const post = new Post({
        title,
        content,
        photo,
        postedBy: req.user
    })

    post.save()
    .then(post => {
        res.status(201).json({
            message: 'Post created',
            post
        })
    })
    .catch(err => console.log(err))
}

exports.likePost = (req, res) => {
    const { postId } = req.body;
    
    Post.findByIdAndUpdate(postId, {
        $push: { likes: req.user._id}
    }, {
        new: true
    }).exec((err, result) => {
        if(err){
            return res.status(422).json({error: err})
        }
        res.json(result)
    })
}


exports.dislikePost = (req, res) => {
    const { postId } = req.body;

    Post.findByIdAndUpdate(postId,{
        $pull: { likes: req.user._id }
    },{
        new: true
    }).exec((err, result) => {
        if(err){
            return res.status(422).json({error: err})
        }
        res.json(result)
    })
}


exports.commentPost = (req, res) => {
    const { text , postId } = req.body;

    const comment = new Comment({
        text,
        postedBy: req.user._id    
    });

    comment.save()
    .then(comment => {
        Post.findByIdAndUpdate(postId, {
            $push: { comments: comment }
        },{
            new: true
        })
        .populate("postedBy","name")
        .populate({
            path: 'comments',
            select: '_id text postedby createdAt',
            model: 'Comment',
            populate: {
                path: 'postedBy',
                select: '_id name',
                model: 'User'
            }
        })
        .exec((err, post) => {
            if(err){
                return res.status(422).json({error: err})
            }

            post.comments.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
            res.json(post)
        })
    })
    .catch(err => console.log(err))
}

exports.deleteComment = (req, res) => {
    const { deleteCommentId } = req.params;
    Comment.findByIdAndDelete(deleteCommentId, (err, result) => {
        if(err){
            return res.status(422).json({error: err})
        }

        res.json(result);
    })
}

exports.updateComment = (req, res) => {
    const { commentId, text } = req.body;
    Comment.findByIdAndUpdate(commentId, {
      text  
    },{
        new: true
    })
    .populate("postedBy","name")
    .exec((err, result) => {
        if(err){
            return res.status(422).json({error: err})
        }
        res.json(result);
    })
}

exports.deletePost = (req, res) => {
    const { postId } = req.params;

    Post.findOne({_id: postId})
    .populate('postedBy','_id')
    .exec((err,post) => {
        if(err || !post){
            return res.status(422).json({error: err})
        }

        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result => {
                res.json(result)
            })
            .catch(err => console.log(err))
        }
    })
}