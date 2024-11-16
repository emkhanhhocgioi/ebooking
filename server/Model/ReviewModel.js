const mongoose = require('mongoose');

const review = new mongoose.Schema({
    HotelID:{type:String,require:true},
    ReviewerID:{type:String,require:true},
    reviewcontent:{type:String,require:true},
    rating:{type:Number,require:true}
}
)
const Review = mongoose.model('Review', review);

module.exports = Review;