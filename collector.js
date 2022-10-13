var express = require('express');
var router = express.Router();
var connection = require('../database.js')
const { check, validationResult} = require("express-validator");
var sanitizeHtml = require('sanitize-html')

const bcrypt = require("bcryptjs")
async function hashAndSalt(password){
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    return hash
}

/* List collectors */
router.get('/record', function (req, res, next) {
    //knex connection
    connection
        .raw(`select * from collector;`) // it is a promise
        .then(function (result) {
            var collectors = result[0];
            if (Object.entries(collectors).length === 0) {

                res.json(404, {
                    status: 404,
                    message: "Not Found"
                })
            }
            else {
                // send back the query result as json
                res.json(200, {
                    collectors:collectors,
                })
            };
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

/*Retrieve a collector based on id*/
router.get('/record/:id', function (req, res, next) {
    //knex connection
    connection
        .raw(`select * from collector where id = ?`, [req.params["id"]])
        .then(function (result) {
            var collector = result[0];
            if (Object.entries(collector).length == 0) {

                res.json(404, {
                    status: 404,
                    message: "Not Found"
                })
            }
            else {
                // send back the query result as json
                res.json(200, {
                    collector: collector
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
router.delete('/delete/:id', function (req, res, next) {
    var promise = connection.raw(
        `
        select * from product
        where collector_id= ?
 `,
        [req.params["id"]]
    );
    promise.then(function (result) {
        var collector = result[0];
        if (Object.entries(collector).length != 0) {

            res.json(403, {
                status: 403,
                message: "Forbidden"
            })
        }
        else {
            promise =connection.raw(
                ` delete from manufacturer where id =?`, [req.params["id"]]
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
    check("id", "Must be six numbers").notEmpty().isInt().isLength({ min: 6, max: 6 }),
    check("name", "Must have a name").notEmpty().isLength({max:45}),
    check("username","Username must not mroe than 10 characters").notEmpty().isLength({max: 10}),
    check("password", "Password not strong enough").notEmpty().isStrongPassword({ minLength: 7, maxLength:10, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1}),
    check("email","Must be an email").notEmpty().isEmail(),
    check("phone_num", "Please provide a phone_number").notEmpty().isInt().isLength({min:9, max:9}),
    check("bank_account_num","Please provide you bank account num").notEmpty().isInt().isLength({min:10, max: 10}),
    check("bank_name","Please provide a bank name").notEmpty(),

    function (req, res, next) {
        console.log("POST Request", req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // error response
            return res.status(400).json({ errors: errors.array() });
        }
        else {
            hashAndSalt(req.body["password"]).then((hashedPassword) =>{
              var promise = connection.raw(
                `
                insert into collector (id, name, username, password, email, phone_num, bank_account_num, bank_name)
                values (?,?,?,?,?,?,?,?)
                `,
                [sanitizeHtml(req.body["id"]), sanitizeHtml(req.body["name"]), sanitizeHtml(req.body["username"]), 
                sanitizeHtml(hashedPassword), sanitizeHtml(req.body["email"]), sanitizeHtml(req.body["phone_num"]), sanitizeHtml(req.body["bank_account_num"]), sanitizeHtml(req.body["bank_name"])]
            )
               promise.then(function (result) {
               res.json(201,{
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
        })
    
    }})

/* Update a manufacturer*/
router.put('/update/:id', 
    check("password", "Password not strong enough").notEmpty().isStrongPassword({ minLength: 7, maxLength:10, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1}),

    
    function (req, res, next) {
    console.log("PUT Request", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // error response
        return res.status(400).json({ errors: errors.array() });
    }
    else{
    var promise = connection.raw(
        `
        select * from collector
        where id= ?
       `,
        [req.params["id"]]
    )};
    promise.then(function (result) {
        var manufacturers = result[0];
        if (Object.entries(manufacturers).length == 0) {

            res.json(403, {
                status: 403,
                message: "Forbidden"
            })
        }
        else {
            hashAndSalt(req.body["password"]).then((hashedPassword) =>{
            promise = connection.raw(
                `
                 update customer
                 set password = ?
                 where id = ?
                 `,
               [sanitizeHtml(hashedPassword), req.params["id"]]
             )
        
          promise.then(function (result) {
          res.json({
            "message": "Done",
        })
      })
    })
    .catch(function (error) {
        // log the error
        console.log(error);
        res.json(500, {
            message: error,
        });
      });
    }
  });
})



module.exports = router;
