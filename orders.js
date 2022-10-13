var express = require('express');
var router = express.Router();
var connection = require('../database.js')
const { check, validationResult} = require("express-validator");
var sanitizeHtml = require('sanitize-html')


/* List orders */
router.get('/record', function (req, res, next) {
    //knex connection
    connection
        .raw(`select * from orders;`) // it is a promise
        .then(function (result) {
            var orders = result[0];
            if (Object.entries(orders).length == 0) {

                res.json(404, {
                    status: 404,
                    message: "Not Found"
                })
            }
            else {
                // send back the query result as json
                res.json(200, {
                    orders: orders,
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

/*Retrieve an order based on id*/
router.get('/record/:id', function (req, res, next) {
    //knex connection
    connection
        .raw(`select * from orders where id = ?`, [req.params["id"]])
        .then(function (result) {
            var record = result[0];
            if (Object.entries(record).length == 0) {

                res.json(404, {
                    status: 404,
                    message: "Not Found"
                })
            }
            else {
                // send back the query result as json
                res.json(200, {
                    record: record
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

/*Delete an order based on id*/
router.delete('/delete/:id', function (req, res, next) {
    var promise = connection.raw(
        `
        select * from orders
        where id= ?
 `,
        [req.params["id"]]
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
                ` delete from orders where id =?`, [req.params["id"]]
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

/*Create a new order*/
router.post('/create',
    check("id", "Must have 2 to 4 numbers").notEmpty().isInt({min:1}).isLength({ min: 2, max: 4 }),
    check("quantity", "Must 1 to 3 numbers").notEmpty().isInt({min:1}).isLength({min:1, max: 3}),
    check("total_price", "Must have price").notEmpty().isFloat({min:1}),
    check("date", "Date must be in YYYY-MM-DD format").notEmpty().isDate(),
    check("product_id","Must have 3 numbers").notEmpty().isInt().isLength({min: 3, max: 3}),
    check ("customer_id","Must have 1 to 4 numbers").notEmpty().isInt().isLength({min: 1, max: 4}),
    
    function (req, res, next) {
        console.log("POST Request", req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // error response
            return res.status(400).json({ errors: errors.array() });
        };
        var promise_1 = connection.raw(
                `
                select * from product
                where id =? 
                `,
                [req.body["product_id"]]
            );
            promise_1.then(function (result){
               var product = result[0];
               if (Object.entries(product).length == 0){
                    res.json(403, {
                    status: 403,
                    message: "Forbidden"
                    })
               }else{
                var promise_2 = connection.raw(
                    `
                    select * from customer
                    where id = ?
                    `,
                    [req.body["customer_id"]]
                    );
                    promise_2.then(function(result) {
                    var customer =result[0];
                    if (Object.entries(customer).length == 0){
                            res.json(403, {
                            status: 403,
                            message: "Forbidden"
                            })
                    }else {
                  connection.raw(
                  `insert into orders (id, quantity, total_price, date, product_id, customer_id)
                   values (?,?,?,?,?,?)
                    `,
                   [sanitizeHtml(req.body["id"]), sanitizeHtml(req.body["quantity"]), sanitizeHtml(req.body["total_price"]), sanitizeHtml(req.body["date"]), 
                   sanitizeHtml(req.body["product_id"]), sanitizeHtml(req.body["customer_id"])]
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
            })
        }
    })
})
            

/* Update an order*/
router.put('/update/:id', 
    check("quantity","Must 1 to 3 numbers").notEmpty().isInt({min:1}).isLength({min:1, max: 3}),
    check("total_price", "Must have a price").notEmpty().isFloat({min:1}),
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
        var order = result[0];
        if (Object.entries(order).length == 0) {

            res.json(403, {
                status: 403,
                message: "Forbidden"
            })
        }
        else {
    
    promise = connection.raw(
        `
        update orders
        set quantity =?,
        total_price = ?
        where id = ?
        `,
        [sanitizeHtml(req.body["quantity"]),sanitizeHtml(req.body["total_price"]), req.params["id"]]
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
