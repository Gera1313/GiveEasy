const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    donorName: {
        type: String,
        required: true // anonymous donations
    },
    fundraiser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fundraiser', // referencing the fundraiser model
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;