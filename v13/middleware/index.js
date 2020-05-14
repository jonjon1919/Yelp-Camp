var Campground = require("../models/campground");
var Comment = require("../models/comments");
//ALL THE MIDDLEWARE
var middlewareObj ={};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	// CHECK CAMPGROUND OWNERSHIP
	if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err){
			   req.flash("error", "Campground not found");
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
				req.flash("error", "You don't have permission")
                res.redirect("back");
            }
           }
        });
    } else {
		req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }	
}


middlewareObj.checkCommentOwnership = function(req, res, next){
// CHECK COMMENT OWNERSHIP
	if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

// Is Logged in Middleware
middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
}


module.exports = middlewareObj