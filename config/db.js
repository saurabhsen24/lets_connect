const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => {
    console.log("Conencted to MongoDB");
})
.catch(err => {
    console.log("Error in connecting with the DB ", err);
})