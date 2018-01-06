var express     = require("express"),
    app         = express(),
    seedsDB     = require("./seeds"),
    flash = require("connect-flash"),
    methodOverride     = require("method-override"),
    mongoose    = require("mongoose"),
    bodyParser  = require("body-parser"),
    Users   = require("./models/users"),
    Comment   = require("./models/comments"),
    Galleries   = require("./models/gallery"),
    passport = require("passport"),
    LocalStratergy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyB_nPb-l4MyQAHexaE36bohxX4CRAJ6m0A'
});
    
    googleMapsClient.geocode({ address: '1600 Amphitheatre Parkway, Mountain View, CA'}, function(err, response) {
        if (!err) {
            console.log(response.json.results);
                  }
});
    
    
    
var commentRoutes = require("./routes/comments"),
    galleryRoutes = require("./routes/gallery"),
    indexRoutes = require("./routes/index"); 

app.use(flash());   
// seedsDB(); //Seed the database
    
//===================
//==Setup Passport ==
//===================
app.use(require("express-session")({
    secret: "I'm not afraid",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

passport.use(new LocalStratergy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

//=======================
//==connect to mongoose==    
//=======================
// export DATABASEURL=mongodb://localhost/captureDatabase
mongoose.connect(process.env.DATABASEURL);
//mongose.connect("mongodb://localhost/captureDatabase");

//mongoose.connect("mongodb://sid:sidcapturedatabase2893@ds045531.mlab.com:45531/capture");

//=====================
//==set engine to ejs==
//=====================
app.set("view engine", "ejs");

//===========================
//==bodyParser for the body==
//===========================
app.use(bodyParser.urlencoded({extended: true}));

//==============================
//==Including the external css==
//==============================
app.use(express.static(__dirname + "/public"));

//Middleware for Navbar buttons to check current user.
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.errorMessage = req.flash("error");
    res.locals.successMessage = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/gallery", galleryRoutes);
app.use("/gallery/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Capture's Server has Started");
}); 