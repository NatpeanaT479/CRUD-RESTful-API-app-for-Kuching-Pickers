var express = require('express');
var router = express.Router();
var connection = require('../database.js')
const { check, validationResult} = require("express-validator");
var sanitizeHtml = require('sanitize-html')
const bcrypt = require("bcryptjs");
 async function hashAndSalt(password){
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    return hash
}

/* List of customers */
router.get('/record', function (req, res, next) {
    //knex connection
    connection
        .raw(`select * from customer;`) // it is a promise
        .then(function (result) {
            var customers = result[0];
            if (Object.entries(customers).length === 0) {

                res.json(404, {
                    status: 404,
                    message: "Not Found"
                })
            }
            else {
                // send back the query result as json
                res.json(200, {
                    customers: customers,
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
/*Retrieve a customer based on id*/
router.get('/record/:id', function (req, res, next) {
    //knex connection
    connection
        .raw(`select * from customer where id = ?`, [req.params["id"]])
        .then(function (result) {
            var customer = result[0];
            if (Object.entries(customer).length == 0) {

                res.json(404, {
                    status: 404,
                    message: "Not Found"
                })
            }
            else {
                // send back the query result as json
                res.json(200, {
                    customer: customer
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
router.delete('/delete/:custmrId', function (req, res, next) {
    var promise = connection.raw(
        `
        select * from orders
        where customer_id = ?
       `,
        [req.params["custmrId"]]
    );
    promise.then(function (result) {
        var customer = result[0];
        if (Object.entries(customer).length != 0) {

            res.json(403, {
                status: 403,
                message: "Forbidden"
            })
        }
        else {
            promise =connection.raw(
                ` delete from customer where id =?`, [req.params["custmrId"]]
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

/*Create a new customer*/
router.post('/create',
    check("id", "Must be 3 numbers").notEmpty().isInt({min: 1}).isLength({ min: 1, max: 3 }),
    check("name", "Must have a name").notEmpty().isLength({max:45}),
    check("username","Must have username and not more than 10 characters").notEmpty().isLength({max: 10}),
    check("password", "Password not strong enough").notEmpty().isStrongPassword({ minLength: 7, maxLength:10, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1}),
    check("address","Must provide address").notEmpty().isLength({max: 45}),
    check("postal_code","Must provide postcode").notEmpty().isLength({min: 5,max:5}),
    check("city", "Must provide a city").notEmpty().isLength({max: 45}),
    check("state","Must provide a state").notEmpty().isLength({max: 20}),
    check("country","Must provide a country").notEmpty().isLength({max: 20}),
    check("email","Must be an email").notEmpty().isEmail(),
    check("phone_num", "Please provide a phone_number").notEmpty().isInt().isLength({min:9, max:9}),

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
                insert into customer (id, name,	username, password,	address, postal_code, city, state, country,	email, phone_num)
                values (?,?,?,?,?,?,?,?,?,?,?)
                `,
                [sanitizeHtml(req.body["id"]), sanitizeHtml(req.body["name"]), sanitizeHtml(req.body["username"]), sanitizeHtml(hashedPassword), 
                sanitizeHtml(req.body["address"]), sanitizeHtml(req.body["postal_code"]), sanitizeHtml(req.body["city"]),
                sanitizeHtml(req.body["state"]), sanitizeHtml(req.body["country"]), sanitizeHtml(req.body["email"]), sanitizeHtml(req.body['phone_num'])]
            )
            promise.then(function (result) {
               res.json(201,{"message": "Done",})
            })   
             .catch(function (error) {
                // log the error
                console.log(error);
                res.json(500, {
                    message: error,
                });
            });
            })
        }
    })
           
          

/* Update a customer*/
router.put('/update/:id', 
    check("password", "Password not strong enough").notEmpty().isStrongPassword({ minLength: 7, maxlegnth:10, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1}),

    
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
        select * from customer
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

     }).catch(function (error) {
        // log the error
        console.log(error);
        res.json(500, {
            message: error,
        })
      });
    }}
 )}
)
    




module.exports = router;
