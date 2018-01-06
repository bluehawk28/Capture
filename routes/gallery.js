var express = require("express");
var router = express.Router({mergeParams: true});
var Comment   = require("../models/comments"),
    Galleries   = require("../models/gallery"),
    middleware   = require("../middleware");
     
//Show all Images Route
router.get("/", function(req,res){
    Galleries.find(
        {},
        function(err, allGalleries){ 
        if(err){
            console.log(err);
        }else{
            res.render("gallery/index",{listGalleries: allGalleries}); //Showing all captures retriving them from database
     }
    })
});

//Handles all Show Images logic route
router.post("/", middleware.isLoggedIn, function(req, res){
    var image = req.body.image;
    var location = req.body.location;
    var caption = req.body.caption;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newGallery = {image: image,location: location, caption: caption, author: author};
    
    Galleries.create(newGallery, function(err, gallery){
            if(err){
              console.log(err);
            }else{
                res.redirect("/gallery");
            }
    });
});

//New Image Route
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("gallery/new");
});

router.get("/location", middleware.isLoggedIn, function(req, res){
    res.render("gallery/location");
});

//Show Particular Image by id Route
router.get("/:id", function(req, res){
    Galleries.findById(req.params.id).populate("comments").exec(function(err, foundGallery){
        if(err || !foundGallery){
            req.flash("error","Image not found.");
            res.redirect("back");
        }else{
            res.render("gallery/show",{gallery: foundGallery});        
        }
    });
});

//Edit Image
router.get("/:id/edit", middleware.checkImageOwnership, function(req, res){
       Galleries.findById(req.params.id, function(err, foundGallery){
           if(err){
               throw err;
           }else{
                res.render("gallery/edit",{gallery: foundGallery});    
           }
            
       });
});
 
//Update Image
router.put("/:id", middleware.checkImageOwnership, function(req, res){
    
    Galleries.findByIdAndUpdate(req.params.id, req.body.gallery, function(err, updatedGallery){
        if(err){
            res.redirect("/gallery");
        }else{
            res.redirect("/gallery/"+ req.params.id);
        }
    })
});

//Destroy Image
router.delete("/:id", middleware.checkImageOwnership, function(req, res){
    Galleries.findByIdAndRemove(req.params.id, function(err, deletedImage){
        if(err){
            res.redirect("/gallery");
        }else{
            res.redirect("/gallery");
        }
    });
    
});


module.exports = router;