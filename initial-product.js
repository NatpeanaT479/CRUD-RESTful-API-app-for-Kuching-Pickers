/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  return knex.raw(
    `
    insert into product (id, name, price, image_url, manufacturer_id, collector_id)

    values (789, "Mortal Kombat (2021) Original Cinema Poster - Core Character",	370.00,	"/images/mortal_kombat.jpg", 8907, 123790),
    (245,	"Marvel The Avengers (Comic Panels) Original Licensed Poster",	150.00,	"/images/avengers.jpg",	8907,	123790),
    (908,	"Back To The Future Trilogy Set Poster the future",	350.00,	"/images/back_to_the_future.jpg",	8907,	924547),
    (167,	"Marvel Avengers Endgame Doctor Strange Eye of Agamotto 1:1 Scale Licensed Prop Replica Necklace",	599.00,	"/images/eye_of_agamoto.jpg",	1127,	313934),
    (233,	"Marvel Black Panther T’Challa 10-Claw Wakanda Necklace",	459.99,	"/images/blackpanter.jpg",	1127,	313934),
    (411,	"Monopoly Game Of Thrones Edition",	160.00,	"/images/monopoly_got.jpg",	1127,	217463),
    (710,	"Monopoly Star Wars The Mandalorian - The Child Edition",	160.00,	"/images/monopoly_sw.jpg",	1127,	217463),
    (300,	"Star Wars : The Rise Of Skywalker Official Dolby Cinema™️ Art Poster",	19.99,	"/images/rise_of_skywalker.jpg",	3578,	908400),
(909,	"Mighty Morphin Power Rangers The Movie Art-Poster",	120.00,	"/images/power_rangers.jpg",	8907,	106982),
(882,	"Bandai S.H.Figuarts Dragonball Z Action Figures Series: Perfect Cell",	548.00,	"/images/perfect_cell.jpg",	7110,	924547),
(405,	"Star Wars The Black Series Wedge Antilles Battle Simulation Helmet",	699.00,	"/images/wedge_antilles.jpeg",	1127,	675088),
(112,	"1/25 Scale 1966 Batmobile",	199.00,	"/images/batmobile.jpg",	9800,	106982),
(304,	"DC Super Heroes The Flash Bag",	200.00,	"/images/flashbag.jpg",	6248,	675088),
(217,	"Hasbro G.I. Joe Retro Collection Snake Eyes & Storm Shadow (Hasbro Pulse EXCLUSIVE)",	248.00,	"/images/gijoe.jpg",	1127,	106982),
(756,	"Star Wars The Black Series Poe Dameron Electronic X-Wing Pilot Helmet",	399.00,	"/images/poehelmet.jpg",	1127,	675088),
(203,	"Code Geass: Lelouch of the Re;surrection (Original & Licensed Movie / Cinema Poster)",	50.00,	"/images/codegeass.jpg",	3370,	106982),
(299,	"Joker (Original & Licensed Movie / Cinema Poster)",	200.00,	"/images/jokerposter.jpg",	3578,	908400),
(170,	"Polar Lights 1/25 scale 1966 Batcycle Model Kit",	149.00,	"/images/batcycle.jpg",	9800,	924547),
(854,	"Spider-Man : Far From Home (Original & Licensed Movie / Cinema Poster)",	99.00,	"/images/spidermanposter.jpg",	3578,	106982),
(367,	"Jumanji : The Next Level (Original & Licensed Movie / Cinema Poster)",	120.00,	"/images/jumanji.jpg",	3578,	313934),
(240,	"Bandai S.H.Figuarts Dragonball Z Action Figures Series: Son Gohan",	548.00,	"/images/son_gohan.jpg",	7110,	908400)

    as new_data

    on duplicate key update
    name=new_data.name,
    price=new_data.price,
    manufacturer_id=new_data.manufacturer_id,
    collector_id =new_data.collector_id;
    `
    );
};
