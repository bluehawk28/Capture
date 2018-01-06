var mongoose    = require("mongoose");
//Schema for Gallery
var gallerySchema = new mongoose.Schema({
    caption: String,
    location: String,
    image: String,
    author: {
        id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
        },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }] 
});
//Gallery and add schema
module.exports = mongoose.model("Gallery",gallerySchema);