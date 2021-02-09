const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { validateUser } = require('../config/validateUserSchema');


exports.loginUser = (req, res) => {
    const {  email , password } = req.body;
    if(!email || !password){
        return res.status(422).send({
            error: "Some fields are missing"
        })
    }

    User.findOne({email: email})
    .then(savedUser => {
        if(!savedUser){
            return res.status(422).json({
                error: "Invalid email or password"
            })
        }

        bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
            if(doMatch){
                const token = jwt.sign({_id: savedUser._id}, process.env.TOKEN_SECRET);
        
                const { _id, name , email } = savedUser;

                res
                .status(200)
                .json({
                    message: 'Login Success',
                    token,
                    user: { _id, name , email}
                })
            }else{
                return res.status(401).send({
                    error: 'Invalid email or password'
                })
            }
        })
    })
    .catch(err => res.status(404).send({error: 'User not found!'}))
}


exports.signUpUser = (req, res) => {
    const { name , email , password } = req.body;
    if(!name || !email || !password){
        return res.status(422).send({ error: 'Please add all fields' })
    }

    const { error } = validateUser({name, email , password})

    if(error){
        return res.status(400).send({error: error.details[0].message});
    }

    User.findOne({email: email})
    .then(savedUser => {
        
        if(savedUser){
            return res.status(422).send({
                error: 'User with this email already exists'
            })
        }

        bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                name, 
                email,
                password: hashedPassword
            })

            user.save()
            .then(user => {
               return res.status(200).json({
                    message: 'User saved Successfully'
                })
            })
            .catch(err => console.log(err))
        })
        .catch(err => res.status(422).send({error: err}));
    })
    .catch(err => console.log(err))
}

