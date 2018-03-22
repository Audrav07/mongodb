var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var exphbs = require("express-handlebars");
var axios = require("axios");
var cheerio = require("cheerio");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server


var Comment = require("./models/comment");
var Article = require("./models/article");
var databaseURL = 'mongodb://localhost/mongoScraper';


if(process.env.MONGODB_URI){
	mongoose.connect(process.env.MONGODB_URI);
}
else{
	mongoose.connect(databaseURL);
};
// Require all models




mongoose.Promise = Promise;
var db = mongoose.connection;

db.on("error", function(error){
	console.log("Mongoose Error: ", error);
});

db.once("open", function(){
	console.log("Mongoose connection successful.");
});

var app = express();
var PORT = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));
// app.use(method("_method"));
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.listen(PORT, function(){
	console.log("Listening on port " + PORT);
})

//routes

app.get("/", function(req, res) {
	Article.find({}, null, {sort: {created: -1}}, function(err, data) {
		if(data.length === 0) {
			res.render("placeholder", {message: "There's nothing scraped yet. Please click \"Scrape For Newest Articles\" for fresh and delicious news."});
		}
		else{
			res.render("index", {articles: data});
		}
	});
});

app.get("/scrape", function(req, res) {
	request("https://www.nytimes.com/section/technology", function(error, response, html) {
		var $ = cheerio.load(html);
		    $("div.story-body").each(function(i, element) {
		    console.log(element);	
		var result = {};
		var link = $(element).find("a").attr("href");
			var title = $(element).find("h2.headline").text().trim();
			var summary = $(element).find("p.summary").text().trim();
			var img = $(element).parent().find("figure.media").find("img").attr("src");
			result.link = link;
			result.title = title;
			if (summary) {
				result.summary = summary;
			};
			if (img) {
				result.img = img;
			}
			else {
				result.img = $(element).find(".wide-thumb").find("img").attr("src");
			};
			var entry = new Article(result);
			Article.find({title: result.title}, function(err, data) {
				if (data.length === 0) {
					entry.save(function(err, data) {
						if (err) throw err;
					});
				}
			});
		});
		console.log("Scrape finished.");
		res.redirect("/");
	});
});

// 		console.log(result);

// result.type = $(this)
//         .children("div")
//         .text();
// result.link = $(this)
//         .children("a")
//         .attr("href");

//       // Create a new Article using the `result` object built from scraping
//       db.Article.create(result)
//         .then(function(dbArticle) {
//           // View the added result in the console
//           console.log(dbArticle);
//         })
//         .catch(function(err) {
//           // If an error occurred, send it to the client
//           return res.json(err);
//         });
//     });
// });

	
// 		console.log("Scrape finished.");
// 		// res.send("scrape finished");
// 		res.redirect("/");
// 	});
// });

    // If we were able to successfully scrape and save an Article, send a message to the client
//     res.send("Scrape Complete");
// });
// });


// });


// 		$("div.story-body").each(function(i, element) {
// 			var link = $(element).find("a").attr("href");
// 			var title = $(element).find("h2.headline").text().trim();
// 			var summary = $(element).find("p.summary").text().trim();
// 			var img = $(element).parent().find("figure.media").find("img").attr("src");
// 			result.link = link;
// 			result.title = title;
// 			if (summary) {
// 				result.summary = summary;
// 			};
// 			if (img) {
// 				result.img = img;
// 			}
// 			else {
// 				result.img = $(element).find(".wide-thumb").find("img").attr("src");
// 			};
// 			var entry = new Article(result);
// 			Article.find({title: result.title}, function(err, data) {
// 				if (data.length === 0) {
// 					entry.save(function(err, data) {
// 						if (err) throw err;
// 					});
// 				}
// 			});
// 		});
// 		console.log("Scrape finished.");
// 		res.redirect("/");
// 	});
// });

app.get("/saved", function(req, res) {
	Article.find({issaved: true}, null, {sort: {created: -1}}, function(err, data) {
		if(data.length === 0) {
			res.render("placeholder", {message: "You have not saved any articles yet. Try to save some delicious news by simply clicking \"Save Article\"!"});
		}
		else {
			res.render("saved", {saved: data});
		}
	});
});

app.get("/:id", function(req, res) {
	Article.findById(req.params.id, function(err, data) {
		res.json(data);
	})
})

// app.post("/search", function(req, res) {
// 	console.log(req.bodyParser.search);
// 	Article.find({$text: {$search: req.bodyParser.search, $caseSensitive: false}}, null, {sort: {created: -1}}, function(err, data) {
// 		console.log(data);
// 		if (data.length === 0) {
// 			res.render("placeholder", {message: "Nothing has been found. Please try other keywords."});
// 		}
// 		else {
// 			res.render("search", {search: data})
// 		}
// 	})
// });

app.post("/save/:id", function(req, res) {
	Article.findById(req.params.id, function(err, data) {
		if (data.issaved) {
			Article.findByIdAndUpdate(req.params.id, {$set: {issaved: false, status: "Save Article"}}, {new: true}, function(err, data) {
				res.redirect("/");
			});
		}
		else {
			Article.findByIdAndUpdate(req.params.id, {$set: {issaved: true, status: "Saved"}}, {new: true}, function(err, data) {
				res.redirect("/saved");
			});
		}
	});
});

app.post("/comment/:id", function(req, res) {
	var comment = new Comment(req.body);
	comment.save(function(err, doc) {
		if (err) throw err;
		Article.findByIdAndUpdate(req.params.id, {$set: {"comment": doc._id}}, {new: true}, function(err, newdoc) {
			if (err) throw err;
			else {
				res.send(newdoc);
			}
		});
	});
});

app.get("/comment/:id", function(req, res) {
	var id = req.params.id;
	Article.findById(id).populate("comment").exec(function(err, data) {
		res.send(data.comment);
	})
})




