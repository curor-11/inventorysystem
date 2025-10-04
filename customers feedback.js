const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    sneaker_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sneaker' },
    rating: { type: Number, min: 1, max: 5 },
    review_text: { type: String },
    image: { type: String }, // URL to an image
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
