const mongoose = require('mongoose');

const fundraiserSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    goalAmount: {
        type: Number,
        required: true
    },
    currentAmount: {
        type: Number,
        default: 0 // Donations will add to this amount
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // Not sure if I want to keep this last one. Tracks who created the fundraiser
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
    }
});

const Fundraiser = mongoose.model('Fundraiser', fundraiserSchema);

module.exports = Fundraiser;
