const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().required()
})


exports.validateUser = (user) => {
    return userSchema.validate(user);
}