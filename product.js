var express = require('express');
var router = express.Router();
var connection = require('../database.js')
const { check, validationResult} = require("express-validator");
var sanitizeHtml = require('sanitize-html')

/* List products */
router.get('/catalogue', function (req, res, next) {
    //knex connection
    connection
        .raw(`select * from product;`) // it is a promise
        .then(function (result) {
            var products = result[0];
            if (Object.entries(products).length == 0) {

                res.json(404, {
                    status: 404,
                    message: "Not Found"
                })
            }
            else {
                // send back the query result as json
                res.json(200, {
                    products: products,
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

/*Retrieve a product based on id*/
router.get('/catalogue/:id', function (req, res, next) {
    //knex connection
    connection
        .raw(`select * from product where id = ?`, [req.params["id"]])
        .then(function (result) {
            var product = result[0];
            if (Object.entries(product).length == 0) {

                res.json(404, {
                    status: 404,
                    message: "Not Found"
                })
            }
            else {
                // send back the query result as json
                res.json(200, {
                    product: product
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

/*Delete a product based on id*/
router.delete('/delete/:id', function (req, res, next) {
    var promise = connection.raw(
        `
        select * from orders
        where product_id= ?
 `,
        [req.params["id"]]
    );
    promise.then(function (result) {
        var orders = result[0];
        if (Object.entries(orders).length != 0) {

            res.json(403, {
                status: 403,
                message: "Forbidden"
            })
        }
        else {
            promise =connection.raw(
                ` delete from product where id =?`, [req.params["id"]]
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

/*Create a new product*/
router.post('/create',
    check("id", "Must be 3 numbers").notEmpty().isInt().isLength({ min: 3, max: 3 }),
    check("name", "Must have a name").notEmpty(),
    check("price", "Must have price").notEmpty().isFloat({min:1}),
    check("image_url", "Must have a picture").notEmpty(),
    check("manufacturer_id","Must have 4 numbers").notEmpty().isInt().isLength({min: 4, max: 4}),
    check ("collector_id","Must have 6 numbers").notEmpty().isInt().isLength({min: 6, max: 6}),
    
    function (req, res, next) {
        console.log("POST Request", req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // error response
            return res.status(400).json({ errors: errors.array() });
        };
        var promise_1 = connection.raw(
                `
                select * from manufacturer
                where id =? 
                `,
                [req.body["manufacturer_id"]]
            );
            promise_1.then(function (result){
               var manufacturer = result[0];
               if (Object.entries(manufacturer).length == 0){
                    res.json(403, {
                    status: 403,
                    message: "Forbidden"
                    })
               }else{
                var promise_2 = connection.raw(
                    `
                    select * from collector 
                    where id = ?
                    `,
                    [req.body["collector_id"]]
                    );
                    promise_2.then(function(result) {
                    var collector =result[0];
                    if (Object.entries(collector).length == 0){
                            res.json(403, {
                            status: 403,
                            message: "Forbidden"
                            })
                    }else {
                  connection.raw(
                  `insert into product (id, name, price, image_url, manufacturer_id, collector_id)
                   values (?,?,?,?,?,?)
                    `,
                  [sanitizeHtml(req.body["id"]), sanitizeHtml(req.body["name"]), sanitizeHtml(req.body["price"]), sanitizeHtml(req.body["image_url"]), 
                  sanitizeHtml(req.body["manufacturer_id"]), sanitizeHtml(req.body["collector_id"])]
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
            

/* Update a product*/
router.put('/update/:id', 
    check("price", "Must have a price").notEmpty().isFloat({min:0}),
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
        select * from product
        where id= ?
       `,
        [req.params["id"]]
    )};
    promise.then(function (result) {
        var product = result[0];
        if (Object.entries(product).length == 0) {

            res.json(403, {
                status: 403,
                message: "Forbidden"
            })
        }
        else {
    
    promise = connection.raw(
        `
        update product
        set price = ?
        where id = ?
        `,
        [sanitizeHtml(req.body["price"]), req.params["id"]]
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
