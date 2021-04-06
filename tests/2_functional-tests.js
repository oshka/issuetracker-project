const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
var expect = chai.expect;
const server = require('../server');
const apiRoutes         = require('../routes/api.js');
var IssueModel = require('../models/issue_model.js');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(20000);
//Create an issue with every field: POST request to /api/issues/{project}
test('Create an issue with every field', function(done) {
      chai.request(server)
      .post('/api/issues/apitest')
      .send({  'issue_title': 'Test title','issue_text': 'Test text', 'created_by': 'Test created by','assigned_to': 'Test assigned to','status_text': 'Test status text' })
      .end(function (err, res) {       
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        assert.isObject(res);
        assert.include(res.text,"issue_title",'Test title','issue_text','Test text','created_by','Test created by','assigned_to','Test assigned to','status_text','Test status text');
        done()
      });
});
//Create an issue with only required fields: POST request to /api/issues/{project}
test('Create an issue with only required fields', function(done) {
      chai.request(server)
      .post('/api/issues/apitest')
      .send({  'issue_title': 'Test title','issue_text': 'Test text', 'created_by': 'Test created by' })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        assert.isObject(res);
        assert.include(res.text,"issue_title",'Test title','issue_text','Test text','created_by','Test created by');
        done()
      });
});
//Create an issue with missing required fields: POST request to /api/issues/{project}
test('Create an issue with missing required fields', function(done) {
      chai.request(server)
      .post('/api/issues/apitest')
      .send({})
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        assert.isObject(res);
        assert.include(res.text,"required field(s) missing");
        done()
      });
});
//View issues on a project: GET request to /api/issues/{project}
test('View issues on a project', function(done) {
      chai.request(server)
      .get('/api/issues/apitest')
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        assert.isObject(res);
        assert.include(res.text,"issue_title",'Test title','issue_text','Test text','created_by','Test created by');
        done()
      });
});



//View issues on a project with one filter: GET request to /api/issues/{project}
test('View issues on a project with one filter', function(done) {
      chai.request(server)
      .get('/api/issues/apitest')
      .query({ issue_title: "Test title" })
      .end(function (err, res) {
        //console.log(res.body);
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        assert.isObject(res);
        assert.include(res.text,"issue_title",'Test title');
        done()
      });
});
//View issues on a project with multiple filters: GET request to /api/issues/{project}
test('View issues on a project with multiple filter', function(done) {
      chai.request(server)
      .get('/api/issues/apitest?issue_title=Test%20title&issue_text=Test%20text')
      .end(function (err, res) {        
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        assert.isObject(res);
        assert.include(res.text,"issue_title",'Test title',"issue_text",'Test text');
        done()
      });
});
//get value od _id
//Update one field on an issue: PUT request to /api/issues/{project}
test('Update one field on an issue', function(done) {
    IssueModel.findOne({ issue_title: 'Test title' }, function (err, issue) {
    chai.request(server)
        .put('/api/issues/apitest')
        .send({  '_id': issue._id,'issue_title': 'Test title updated'})
        .end(function (err, res) {
        /// console.log(res.text);
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          assert.isObject(res);
          assert.include(res.text,'successfully updated');
          done()
      });

    });  
});
//Update multiple fields on an issue: PUT request to /api/issues/{project}
test('Update multiple fields on an issue', function(done) {
    IssueModel.findOne({ issue_title: 'Test title' }, function (err, issue) {
    chai.request(server)
        .put('/api/issues/apitest')
        .send({  '_id': issue._id,'issue_title': 'Test title updated','issue_text': 'Test text updated','created_by':'Test created by updated' })
        .end(function (err, res) {
        /// console.log(res.text);
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          assert.isObject(res);
          assert.include(res.text,'successfully updated');
          done()
      });

    });  
});
//Update an issue with missing _id: PUT request to /api/issues/{project}
test('Update an issue with missing _id', function(done) {
   
    chai.request(server)
        .put('/api/issues/apitest')
        .send({ '_id':"",'issue_title': 'Test title updated','issue_text': 'Test text updated','created_by':'Test created by updated' })
        .end(function (err, res) {
         console.log(res.text);
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          assert.isObject(res);
          assert.include(res.text,'missing _id');
          done()
});
});
//Update an issue with no fields to update: PUT request to /api/issues/{project}
test('Update an issue with no fields to update', function(done) {
    IssueModel.findOne({ issue_title: 'Test title updated' }, function (err, issue) {
    chai.request(server)
        .put('/api/issues/apitest')
        .send({ '_id': issue._id})
        .end(function (err, res) {
        /// console.log(res.text);
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          assert.isObject(res);
          assert.include(res.text,"no update field(s) sent");
          done()
      });

    });  
});
//Update an issue with an invalid _id: PUT request to /api/issues/{project}
test('Update an issue with an invalid _id', function(done) {
    
    chai.request(server)
        .put('/api/issues/apitest')
        .send({ _id: '1111',  issue_title: 'Test title updated'})
        .end(function (err, res) {
        /// console.log(res.text);
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          assert.isObject(res);
          assert.include(res.text,"could not update");
          done()     

    });  
});
//Delete an issue: DELETE request to /api/issues/{project}
test('Delete an issue', function(done) {
    IssueModel.findOne({ issue_title: 'Test title updated' }, function (err, issue) {
    chai.request(server)
        .delete('/api/issues/apitest')
        .send({ _id:issue._id })
        .end(function (err, res) {
        /// console.log(res.text);
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          assert.isObject(res);
          assert.include(res.text,"successfully deleted");
          done()
      });

    });  
});
//Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
test('Delete an issue with an invalid _id', function(done) {
    
    chai.request(server)
        .delete('/api/issues/apitest')
        .send({_id: '1111' })
        .end(function (err, res) {
        /// console.log(res.text);
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          assert.isObject(res);
          assert.include(res.text,"could not delete");
          done()
      });

      
});
//Delete an issue with missing _id: DELETE request to /api/issues/{project}
test('Delete an issue with missing _id', function(done) {
   
    chai.request(server)
        .delete('/api/issues/apitest')
        .send({ })
        .end(function (err, res) {
        /// console.log(res.text);
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          assert.isObject(res);
          assert.include(res.text,"missing _id");
          done()
      });

      
});
});
