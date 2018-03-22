var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Commentschema = new Schema({
	title: {
		type: String,
	},
	body: {
		type: String,
	}
});

var Comment = mongoose.model("Comment", Commentschema);
module.exports = Comment;