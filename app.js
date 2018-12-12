var express         = require("express"),
    app             = express(),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    User            = require("./models/user"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    bodyParser      = require("body-parser"),
    expressSanitizer = require("express-sanitizer")

var indexRoutes     = require("./routes/index"),
    newPostRoute    = require("./routes/newPost"),
    commentRoutes   = require("./routes/comment");
    
app.use(flash());
app.set("view engine", "ejs");

app.locals.moment = require("moment");
mongoose.connect("mongodb://localhost/blog");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use(newPostRoute);
app.use(commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});