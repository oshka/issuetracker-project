'use strict';
/** DB **/
const mongoose = require("mongoose");
mongoose.connect(process.env.DB || "mongodb://localhost/exercise-track");

// mongoose connection
mongoose.connect(
    process.env.DB,
    {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true},
    function (err, db) {
        if (err) {
            console.log('Unable to connect to the server. Please start the server. Error1:', err);
        } else {
            console.log('Connected to Server successfully!');
        }
    });
var Issue = new mongoose.Schema({
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

});
var IssueModel = mongoose.model('Issue', Issue);

/** DB **/
module.exports = function (app) {

    app.route('/api/issues/:project')

        .get(function (req, res) {
            let project = req.params.project;

            var result = [];
            IssueModel.find(req.query, function (err, issues) {
                for (var i = 0; i < issues.length; i++) {
                    result.push(issues[i]);
                }
                res.json(issues);
            });
        })

        .post(function (req, res) {
            let project = req.params.project;
            if (req.body.issue_title == "" || req.body.issue_text == "" || req.body.created_by == "") {
                res.json({error: 'required field(s) missing'});
            }
            var issue = new IssueModel(req.body);

            issue.save(function (err) {
                if (err) return console.log(err);
                if (!issue.hasOwnProperty('assigned_to')) {
                    issue.assigned_to = "";
                }
                if (!issue.hasOwnProperty('status_text')) {
                    issue.status_text = "";
                }
                res.json(issue);
            });


        })

        .put(function (req, res) {
            let project = req.params.project;
            if (req.body._id == "") {
                res.json({error: 'required field(s) missing'});
            } else if (req.body.issue_title == "" && req.body.issue_text == "" && req.body.created_by == "" && req.body.assigned_to == "" && req.body.status_text == "") {
                res.json({error: 'no update field(s) sent', '_id': req.body._id});
            }
            console.log(req.body);
            IssueModel.findByIdAndUpdate(req.body._id, req.body, function (err, issue) {
                if (err) res.json({error: 'could not update', '_id': req.body._id});
            });

            IssueModel.findById(req.body._id, function (err, issue) {
                res.json(issue);
            });

        })

        .delete(function (req, res) {
            let project = req.params.project;
            if (req.body._id == "") {
                res.json({error: 'missing _id'});
            }

            IssueModel.findByIdAndDelete(req.body._id, function (err, docs) {
                if (err) {
                    res.json({error: 'could not delete', '_id': req.body._id});
                } else {
                    res.json({result: 'successfully deleted', '_id': req.body._id});
                }
            });
        });

};
