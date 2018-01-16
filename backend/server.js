var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = new express();
var nodeadmin = require('nodeadmin');
var Sequelize = require("sequelize");
var sequelize = new Sequelize('db', 'root', '', { dialect: 'mysql', host: '127.0.0.1', port: 3306 });
var data = [{id:1},{id:2},{id:3}];
// define entity 
var Events = sequelize.define('events', { summary: {     type: Sequelize.STRING,     field: 'summary' },start: {     type: Sequelize.STRING,     field: 'start' },end: {     type: Sequelize.STRING,     field: 'end' },description: {     type: Sequelize.STRING,     field: 'description' },location: {     type: Sequelize.STRING,     field: 'location' } }, { timestamps: false });
app.use(nodeadmin(app));
app.use(bodyParser.json());
app.use(cors());

// include static files in the admin folder 
app.use('/admin', express.static('admin'));
// create an events
app.post('/events', function(request,response) { Events.create(request.body).then(function(event) {       Events.findById(event.id).then(function(event) {           response.status(201).send(event);       }); }); });
app.get('/events', function(request,response){      /*global Event*/     Events.findAll().then(function(events){         response.status(200).send(events);     }); });
app.get('/events/:id', function(request,response){     Events.findById(request.params.id).then(function(event){         if(event) {             response.status(200).send(event);         } else {             response.status(404).send();       }     }); });
app.put('/events/:id', function(request,response){     Events.findById(request.params.id).then(function(event){             if(event) {event.updateAttributes(request.body).then(function(){  response.status(200).send('updated'); })                    .catch(function(error){                         console.warn(error);                         response.status(500).send('server error');                     });             } else {                 response.status(404).send();             }         }); });
// delete an event by id 
app.delete('/events/:id', function(req,res){Events.findById(req.params.id).then(function(event){             if(event) { event.destroy().then(function(){ res.status(204).send(); })                    .catch(function(error){                         console.warn(error);                         res.status(500).send('server error');                     });             } else {                 res.status(404).send();             }         }); });

//CREATE new resource 
app.post('/events', function(request, response) { response.status(201).send(request.body); });
//READ all  
app.get('/events', function(request, response) { response.status(200).send(data); });
//READ one by id 
app.get('/events/:id', function(request, response) { response.status(200).send(data[0]); });
//UPDATE one by id 
app.put('/events/:id', function(request, response) { response.status(201).send(request.body); });
//DELETE one by id 
app.delete('/events/:id', function(request, response) { response.status(201).send('Deleted' + request.params.id); });
app.listen(process.env.PORT);