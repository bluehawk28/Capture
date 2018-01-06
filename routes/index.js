var express = require("express");
var router = express.Router();
var passport = require("passport");
var Users   = require("../models/users"),
    middleware   = require("../middleware");;

//Root Route
router.get("/",function(req,res){
    res.render("landing");
});

//Register Auth Route
router.get("/register", function(req, res){
    res.render("register");
});

//Handles Register logic
router.post("/register", function(req, res){
   var newUser = new Users({username: req.body.username});
   Users.register(newUser, req.body.password, function(err, user){
       if(err){
           req.flash("error",err.message);
           return res.render("register");
       }
       passport.authenticate("local")(req, res, function(){
           req.flash("success","Welcome to Capture "+ user.username+".");
           res.redirect("/gallery");
       });
   });
});

//Login Auth Route
router.get("/login", function(req, res){
   res.render("login"); 
});

//Handles Login logic
router.post("/login", passport.authenticate("local",
                        {   
                            successRedirect: "/gallery", 
                            failureRedirect: "/login"
                        }),
                    function(req, res){
});

//Logout Route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success","You are Logged Out");
    res.redirect("/gallery")
});
module.exports = router;