/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  return knex.raw(
`
insert into manufacturer (id, name, image_url)
values (8907,	"Pyramid International",	"/images/pi.png"),
(1127,	"Hasbro",	"/images/Hasbro.jpg"),
(3578,	"Dolby Laboratories",	"/images/dolby.png"),
(7110,"Tamashii Nations WW",	"/images/logo_tamashii_nations.png"),
(9800,	"Polar Lights",	"/images/polarlights.jpg"),
(6248,	"DC Comics",	"/images/dccomics.jpg"),
(3370,	"GSC",	"/images/gsc.jpg")

as new_data
on duplicate key update
name=new_data.name;
image_url =new_data.image_url;
`
);
};
