/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
   return knex.raw(
`
insert into collector (id, name, username, password, email, phone_num, bank_account_num, bank_name)
values (675088,	"Natasha Anas", "peaNat17",	"gorGo@97",	"nat@gmail.com",	"019789000",	5673900088,	"Ambank"),
(123790,	"Peter Tan",	"tanchng89",	"Lando%@78",	"pete@gmail.com",	"019567908",	7900123477,	"Ambank"),
(908400,	"Awang Iswandi",	"90aswandi",	"omNi@07",	"wandi@gmail.com",	"019231557",	8490373900,	"Ambank"),
(313934,	"Yasser Anas",	"yahud83",	"Gilga@45",	"yahud@gmail.com",	"019911443",	1139087344,	"CIMB"),
(217463,	"Aizuddin Abdullah",	"valorian34",	"alph@$90",	"aizud@gmail.com",	"019312600",	4631227713,	"CIMB"),
(106982,	"Musrif Musa",	"mmusa908",	"Twlgt@77",	"mmusa@gmail.com",	"019770431",	8960010302,	"Maybank"),
(924547,	"Arif Shahmi",	"007ashmi",	"Orlof$%8",	"arifsh@gmail.com",	"019886432",	5574889920,	"Maybank")

as new_data
on duplicate key update
name=new_data.name;
`
);
};
