'use strict';
/** DB **/
require('dotenv').config();
const mongoose = require("mongoose");
var IssueModel = require('../models/issue_model.js');

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


/** DB **/
module.exports = function (app) {

    app.route('/api/issues/:project')

       /* .get(function (req, res) {
            let project = req.params.project;

            var result = [];
            IssueModel.find(req.query, function (err, issues) {
                for (var i = 0; i < issues.length; i++) {
                    result.push(issues[i]);
                }
                return res.json(issues);
            });
        })*/

        .get(function (req, res){
          var project = req.params.project;
          let filterObject = Object.assign(req.query);
          filterObject['project'] =project;
          IssueModel.find(
            filterObject,
            (error, issues) => {
              if(!error && issues){
                return res.json(issues)
              }
            }
          )
        })

        .post(function (req, res, next) {
           var project = req.params.project;

          if (
            req.body.issue_title == "" || req.body.issue_text == "" || req.body.created_by == ""
            || req.body.issue_title == undefined || req.body.issue_text == undefined || req.body.created_by == undefined
            ) 
            {
                return res.json({
                  error: 'required field(s) missing' 
                })
                
            } else {
              var issue = new IssueModel({
                issue_title: req.body.issue_title,
                issue_text: req.body.issue_text,
                created_by: req.body.created_by,
                assigned_to: req.body.assigned_to || '',
                status_text: req.body.status_text || '',
                open: true,
                created_on: new Date().toUTCString(),
                updated_on: new Date().toUTCString(),
                project: project
              }); 

              issue.save((error, savedIssue) => {
                if(!error && savedIssue){
                  return res.json(savedIssue)
                }
              })
            }         

        })

        .put(function (req, res) {
            var project = req.params.project;
            let updateObj = {};
            Object.keys(req.body).forEach((key) => {
                if (req.body[key] != '') {
                  updateObj[key] = req.body[key];
                }
            });
            if (req.body._id == "" ||!req.body.hasOwnProperty('_id')) {
                return res.json({ error: 'missing _id' });
            } else if (Object.keys(updateObj).length < 2) {
                 return res.json({ error: 'no update field(s) sent', '_id': req.body._id });
            } else {
              IssueModel.findByIdAndUpdate(req.body._id, req.body,  (error, updatedIssue) => {
                if (updatedIssue) {
                  return res.json({ result: 'successfully updated', '_id': req.body._id });
                } else {
                  return res.json({ error: 'could not update', '_id': req.body._id });
                }
              });
            }


        })

        .delete(function (req, res) {
          var project = req.params.project;
          if(!req.body._id){
            return res.json({ 'error': 'missing _id' })
          }                
          IssueModel.findByIdAndRemove(req.body._id, (error, deletedIssue) => {
            if(!error && deletedIssue){
              res.json({ result: 'successfully deleted', '_id': req.body._id })
            }else if(!deletedIssue){
              res.json({ error: 'could not delete', '_id': req.body._id })
            }
          })
            


        });

};
