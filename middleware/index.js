//All Middlewares
var Comment   = require("../models/comments"),
    Galleries   = require("../models/gallery");
    
var middlewareObj = {};

middlewareObj.checkImageOwnership = function(req, res ,next){
    if(req.isAuthenticated()){
        Galleries.findById(req.params.id, function(err, foundGallery){
            if(err || !foundGallery){
                req.flash("error","Campground not Found.");
                res.redirect("back");
            }else{
                if(foundGallery.author.id.equals(req.user._id)){
                   next() ;
                }else{
                    req.flash("error","You don't have Permission to do that.");
                    res.redirect("back");    
                }
            }
        });
    }else{
        req.flash("error","You need to be Logged In.");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res ,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error","Comment not Found.")
                res.redirect("back");
            }else{
                    //does the user own the comment?
                if(foundComment.author.id.equals(req.user._id)){
                   next();
                }else{
                    req.flash("error","You need to be Logged In.");
                    res.redirect("back");    
                }
            }
        });
    }else{
        req.flash("error","You don't have Permission to do that.");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be Logged In.");
    res.redirect("/login");
}

module.exports = middlewareObj;
