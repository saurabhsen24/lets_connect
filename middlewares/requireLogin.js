const jwt = require('jsonwebtoken');
const User = require('../models/user');


module.exports = (req, res, next) => {
   
    const { authentication } = req.headers;

    if(!authentication){
        return res.status(401).json({
            error: 'You must log in'
        })
    }

    const token = authentication.replace("Bearer ","");
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        if(err){
            return res.status(401).json({
                error: err.message
            })
        }

        const { _id } = payload;
        User.findById(_id)
            .select('-password')
            .then(userData => {
                req.user = userData;
                next();
            })
            .catch(err => res.status(404).json({error: 'No User Found'}))
    })
}