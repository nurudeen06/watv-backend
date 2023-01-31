const mongoose = require('mongoose');

const listingSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    number: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    category: {
        type: Number,
        default: 0
    },
    link : {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: ''
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
})

listingSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

listingSchema.set('toJSON', {
    virtuals: true,
});

exports.Listing = mongoose.model('Listing', listingSchema);
