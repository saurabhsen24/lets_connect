const axios = require('axios');

const instance = axios.create({
    baseURL: process.env.baseURL ||'http://localhost:5000'
})

module.exports = instance;