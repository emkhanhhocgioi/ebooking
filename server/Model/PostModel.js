const mongoose = require('mongoose');

const post = new mongoose.Schema({
    PostID:{type:String,require:true},
    PosterID:{type:String,require:true},
    HotelName: {type:String,require:true},
    Address: {type:String,require:true},
    price:{type: Number,require:true},
    city:{type:String,require:true},
    country:{type:String,require:true},
    describe: {type:String,require:true},
    addon:{type:String,require:true},
    Posterimage:{type:String,require:true},
    rating:{type:Number,require:true},
    
}
)
const Post = mongoose.model('Post', post);

module.exports = Post;