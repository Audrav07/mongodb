var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Articleschema = new Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    default: "Summary unavailable."
  },
  img: {
    type: String,

  },
  issaved: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: "Save Article"
  },
  created: {
    type: Date,
    default: Date.now
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

Articleschema.index({title: "text"});

var Article  = mongoose.model("Article", Articleschema);
module.exports = Article;