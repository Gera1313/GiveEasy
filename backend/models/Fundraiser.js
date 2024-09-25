const mongoose = require('mongoose'); 

const fundraiserSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
})