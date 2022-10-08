var express = require('express');
var router = express.Router();
var connection = require('../database.js')
const { check, validationResult} = require("express-validator");


/* List manufacturers */
router.get('/catalogue', function( req, res, next) {
//knex connection
connection
.raw(`select * from manufacturer;`) // it is a promise
.then(function (result) {
var manufacturers = result[0];
if (Object.entries(manufacturers).length === 0){
    
    res.json(404,{
         status: 404,
         message:"Not Found"
     })
 }
 else{
// send back the query result as json
res.json(200,{
manufacturers: manufacturers,
})};
})
.catch(function (error) {
// log the error
console.log(error);
 res.status(error.status || 500)
 res.locals.message = error.message;
 res.json(500, {
 "status": error.status || 500,
 "message": error.message
 });
});
})

/*Retrieve manufacturer*/
router.get('/catalogue/:id', function( req, res, next) {
 //knex connection
 connection
 .raw(`select * from manufacturer where id = ?`, [req.params["id"]])
 .then(function (result) {
 var manufacturers = result[0];
 if (Object.entries(manufacturers).length === 0){
    
       res.json(404,{
            status: 404,
            message:"Not Found"
        })
    }
else{
 // send back the query result as json
 res.json(200,{
 manufacturer: manufacturers[0]
 //re:a
 });
 }
})
 .catch(function (error) {
 // log the error
 console.log(error);
 res.status(error.status || 500)
 res.locals.message = error.message;
 res.json(500, {
 "status": error.status || 500,
 "message": error.message
 });
 })
})

/*Delete manufacturer*/
router.delete('/delete/:id', function(req, res, next) {
 var promise = connection.raw(
 `
 select * from product
 where manufacturer_id= ?
 `,
 [req.params["id"]]
 );
 promise.then( function(result) {
    var manufacturers = result[0];
 if (Object.entries(manufacturers).length != 0){
    
    res.json(403,{
         status: 403,
         message:"Forbidden"
     })
 }
 else{
 promise - connection.raw(
   ` delete from manufacturer where id =?`,[req.params["id"]] 
 );
 promise.then(function (result) {
 res.json({
 "message": "Done",
 
 })
});
}
}).catch(function (error) {
 // log the error
 console.log(error);
 res.status(error.status || 500)
 res.locals.message = error.message;
 res.json(500, {
 "status": error.status || 500,
 "message": error.message
 });
 });
});

/*Create a new manufacturer*/
router.post('/create', 
    check("id", "Must be 4 numbers").notEmpty().isInt().isLength({minNumbers:4,maxNumbers:4}),
    check("name","Must have a name").notEmpty(),
    check("image_url").notEmpty(),

function(req, res, next) {
 //console.log("POST Request", req.body);
const errors = validationResult(req);
 if (!errors.isEmpty()) {
 // error response
 return res.status(400).json({ errors: errors.array() });
 }
else{
 var promise = connection.raw(
 `
 insert into manufacturer (id, name, image_url)
 values (?,?,?)
 `,
 [req.body["id"], req.body["name"], req.body["image_url"]]
 )};
 promise.then(function (result) {
 res.json({
 "message": "Done",
 })
})
 .catch(function (error) {
 // log the error
 console.log(error);
 res.json(500, {
 message: error,
 });
 });
});

/* Update a manufacturer*/
router.put('/update/:id', function(req, res, next) {
 console.log("PUT Request", req.body);
 var promise = connection.raw(
 `
 update manufacturer
 set name = ?
 where id = ?
 `,
 [req.body["name"], req.params["id"]]
 );
 promise.then(function (result) {
 res.json({
 "message": "Done",
 })
 }).catch(function (error) {
 // log the error
 console.log(error);
 res.json(500, {
 message: error,
 });
 });
})

module.exports = router;
