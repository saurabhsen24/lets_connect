const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://localhost:5000'
})

if(process.env.NODE_ENV === 'production'){
    module.exports = axios
}else{
    module.exports = instance;
}
