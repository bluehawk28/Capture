var express = require("express");
var router = express.Router({mergeParams: true});
var Comment   = require("../models/comments"),
    Galleries   = require("../models/gallery"),
    middleware   = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    Galleries.findById(req.params.id,function(err, gallery){
        if(err){
            throw err;
        }else{
            res.render("comments/new", {gallery: gallery});
        }
    });
});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
    Galleries.findById(req.params.id, function(err, gallery){
        if(err){
            res.redirect("/gallery");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error","Something went wrong");
                    throw err;
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    gallery.comments.push(comment);
                    gallery.save();
                    req.flash("success","Added comment successfully.");
                    res.redirect("/gallery/"+gallery._id);
                }
            });
        }
    });
});

//Edit Comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Galleries.findById(req.params.id, function(err, foundGallery){
        if(err || !foundGallery){
            req.flash("error","No Image found.");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id,function(err, foundComments){
         if(err && !foundComments){
             res.redirect("back");
         }else{
             res.render("comments/edit", {gallery_id: req.params.id, comment: foundComments});        
         }
        });
   });
    
    
});

//Update Comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComments){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/gallery/"+ req.params.id);
        }
    })
});

//Destroy Comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, deletedComment){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","Comment Deleted.");
            res.redirect("/gallery/" + req.params.id);
        }
    });
    
});

module.exports = router;