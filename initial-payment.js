/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
 return knex.raw(
`
 insert into payment(order_id,	payment_method,	amount)
  values
    (13,	'credit/debit card',	19.99),
    (90,	'credit/debit card',	459.99),
    (56,	'credit/debit card',	599.00),
    (44,	'credit/debit card',	150.00),
    (23,	'credit/debit card',	350.00),
    (45,	'credit/debit card',	19.99),
    (22,	'credit/debit card',	200.00),
    (57,	'credit/debit card',	699.00),
    (89,	'credit/debit card',	548.00),
    (77,	'credit/debit card',	548.00),
    (31,	'credit/debit card',	160.00),
    (28,	'credit/debit card',	198.00),
    (74,	'credit/debit card',	298.00),
    (99,	'fpx',	100.00),
    (34,	'fpx',	160.00),
    (29,	'fpx',	399.00),
    (11,	'fpx',	248.00),
    (12,	'fpx',	199.00),
    (98,	'fpx',	200.00),
    (21,	'fpx',	120.00),
    (83,	'credit/debit card',	350.00),
    (61,	'credit/debit card', 39.98),
    (38,	'credit/debit card',	100.00),
    (54,	'credit/debit card',	370.00),
    (91,	'duitnow',	99.00),
    (40,	'duitnow',	120.00),
    (19,	'duitnow', 370.00),
    (30,	'duitnow',	599.00),
    (26,	'duitnow',	399.00),
    (95,	'duitnow',	370.00)

 
     
`
 );
};

 /*as new_data
     on duplicate key update
      payment_method=new_data.payment_method,
      amount=new_data.amount
*/