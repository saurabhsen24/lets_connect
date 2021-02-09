const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


require('./config/db');

app.use(authRoutes);
app.use(postRoutes);
app.use(userRoutes);


if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get('*',(req, res) => {
        res.sendFile(path.resolve(__dirname, 'client','build','index.html'))
    })
}


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server listening to port number ${port}`));