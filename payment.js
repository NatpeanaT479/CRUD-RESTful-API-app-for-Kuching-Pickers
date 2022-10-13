var express = require('express');
var router = express.Router();
var connection = require('../database.js')
const { check, validationResult} = require("express-validator");
var sanitizeHtml = require('sanitize-html');

/* List of payments */
router.get('/record', function (req, res, next) {
    //knex connection
    connection
        .raw(`select * from payment;`) // it is a promise
        .then(function (result) {
            var payments = result[0];
            if (Object.entries(payments).length === 0) {

                res.json(404, {
                    status: 404,
                    message: "Not Found"
                })
            }
            else {
                // send back the query result as json
                res.json(200, {
                    payments: payments,
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

/*Retrieve a payment based on order_id*/
router.get('/record/:orderid', function (req, res, next) {
    //knex connection
    connection
        .raw(`select * from payment where order_id = ?`, [req.params["orderid"]])
        .then(function (result) {
            var payment = result[0];
            if (Object.entries(payment).length == 0) {

                res.json(404, {
                    status: 404,
                    message: "Not Found"
                })
            }
            else {
                // send back the query result as json
                res.json(200, {
                    payment: payment
                    
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

/*Delete a payment based on order id*/
router.delete('/delete/:orderid', function (req, res, next) {
    var promise = connection.raw(
        `
        select * from orders
        where id= ?
 `,
        [req.params["orderid"]]
    );
    promise.then(function (result) {
        var order = result[0];
        if (Object.entries(order).length != 0) {

            res.json(403, {
                status: 403,
                message: "Forbidden"
            })
        }
        else {
            promise =connection.raw(
                ` delete from payment where order_id =?`, [req.params["orderid"]]
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

/*Create a new payment*/
router.post('/create',
    check("order_id","Must have 2 to 4 numbers").notEmpty().isInt({min:1}).isLength({ min: 2, max: 4 }),
    check("payment_method", "Must have a name and not more than 20 characters").notEmpty().isLength({max: 20}),
    check("amount","Must have price").notEmpty().isFloat({min:1}),

    function (req, res, next) {
        console.log("POST Request", req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // error response
            return res.status(400).json({ errors: errors.array() });
        }
         var promise_1= connection.raw(
                `
                select * from payment
                where order_id =? 
                `,
                [req.body["order_id"]]
            );
            promise_1.then(function (result){
               var payment = result[0];
               if (Object.entries(payment).length != 0){
                    res.json(403, {
                    status: 403,
                    message: "Forbidden"
                    })
        }else{
            var promise_2 = connection.raw(
                `
                select * from orders
                where id =?
                `,
                [req.body["order_id"]]
            );promise_2.then(function (result){
               var payment = result[0];
               if (Object.entries(payment).length == 0){
                    res.json(403, {
                    status: 403,
                    message: "Id given is not in orders table"
                    }) 
               }else{
                connection.raw(
                  `insert into payment (order_id, payment_method, amount)
                   values (?,?,?)
                    `,
                  [sanitizeHtml(req.body["order_id"]), sanitizeHtml(req.body["payment_method"]), sanitizeHtml(req.body["amount"])]
                  )
                  .then(function (result) {
                 res.json(201,{
                "message": "Done",
                })
              })}})
            .catch(function (error) {
                // log the error
                console.log(error);
                res.json(500, {
                    message: error,
                });
            });
        }
    })
});

/* Update a payment*/
router.put('/update/:id', 
    check("payment_method", "Must have a name").notEmpty(),

    
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
        select * from orders
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
    
    promise = connection.raw(
        `
        update payment
        set payment_method = ?
        where order_id = ?
        `,
        [sanitizeHtml(req.body["payment_method"]), req.params["id"]]
    )
        
    promise.then(function (result) {
        res.json({
            "message": "Done",
        })
    })
    }
}).catch(function (error) {
        // log the error
        console.log(error);
        res.json(500, {
            message: error,
        });
    });
})



module.exports = router;
