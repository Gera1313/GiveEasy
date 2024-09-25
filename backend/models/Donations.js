const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    donorName: {
        type: String,
        required: true // optional if anonymous donations are allowed
    },
    fundraiser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fundraiser', // Referencing the Fundraiser model
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;