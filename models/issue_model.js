var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IssueSchema = new Schema({
    issue_title: {
        type: String,
        required: true
    },
    issue_text: {
        type: String,
        required: true
    },
    created_on: {
        type: Date,
        // `Date.now()` returns the current unix timestamp as a number
        default: Date.now
    },
    updated_on: {
        type: Date,
        // `Date.now()` returns the current unix timestamp as a number
        default: Date.now
    },
    created_by: {
        type: String,
        required: true
    },
    assigned_to: {
        type: String,
    },

    open: {
        type: Boolean,
        default: true
    },
    status_text: {
        type: String,
    },
    project: {
        type: String,
    },

});
IssueSchema.pre('save', function(next){
  now = new Date();
  this.updated_on = now;
  if ( !this.created_on ) {
    this.created_on = now;
  }
  next();
});
module.exports = mongoose.model('issue', IssueSchema);     