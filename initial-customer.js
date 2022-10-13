/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  return knex.raw(
    `
    insert into customer (id,	name,	username,	password,	address,	postal_code,	city,	state,	country,	email, 	phone_num)
    
    values 
    (1,	"Yasmin Amri",	"littleyas9",	"Rain@7#",	"21 Semariang Baru",	"93050",	"Kuching",	"Sarawak",	"Malaysia",	"yas@gmail.com",	"0169078659"),
    (2,	"Josh Burns",	"cyrpto70",	"dtEngi@80",	"45 Matang Prima",	"93050",	"Kuching",	"Sarawak",	"Malaysia",	"josh@gmail.com",	"0162370113"),
    (3,	"Adila Fitrah",	"popcrn23",	"ScarL@93",	"90 Semariang Aman",	"93050",	"Kuching",	"Sarawak",	"Malaysia",	"adila@gmail.com",	"0164477123"),
    (4,	"Salina Mahmud",	"toast79",	"jouR@490",	"89 Matang",	"93050",	"Kuching",	"Sarawak",	"Malaysia",	"salina@gmail.com",	"0169012438"),
    (5,	"Adeebah Alif",	"gymjunk32",	"Sparta@23",	"578 Batu Kawa",	"93050",	"Kuching",	"Sarawak",	"Malaysia",	"adee@gmail.com",	"0160011352"),
    (6,	"Glenn Wong",	"acer907y",	"$Mav@211",	"908 BDC",	"93050",	"Kuching",	"Sarawak",	"Malaysia",	"glenn@gmail.com",	"0166099244"),
    (7, "Syamsul Ahmad",	"warpath20",	"Lotr@270",	"23 Semariang Baru",	"93050",	"Kuching",	"Sarawak",	"Malaysia",	"syam@gmail.com",	"0167012888"),
    (8,	"Ninie Kahirul",	"jimin934",	"leeT@900",	"50 Semariang Yayasan",	"93050",	"Kuching",	"Sarawak",	"Malaysia",	"qarl@gmail.com",	"0168900543"),
    (9,	"Mira Jamal",	"miralov17",	"Vent&@70",	"70 Semariang Yayasan",	"93050",	"Kuching",	"Sarawak",	"Malaysia",	"mira@gmail.com",	"0162009178"),
    (10, "Evan Dean",	"evorul100",	"ytigO#$29",	"990 Batu Kawa",	"93050",	"Kuching",	"Sarawak",	"Malaysia",	"evand@gmail.com", "0164723898"),
    (11, "Adam Suffi",	"adamsuf82",	"jkghp0@2",	"345 North Bank",	"93150",	"Kuching",	"Sarawak",	"Malaysia",	"adamsuf@gmail.com",	"0168881234"),
    (12, "Haizar Musa",	"hzrmus27",	"Orion@we1",	"311 Depo", "93150",	"Kuching",	"Sarawak",	"Malaysia",	"haizr@gmail.com", "0160798200"),
    (13, "Elephana Hassan",	"maceleph01",	"exP@122",	"19 Depo", "93150",	"Kuching",	"Sarawak",	"Malaysia",	"elephana@gmail.com", "0163377486"),
    (14, "Ahmad Bakri",	"mdw003",	"Nodmon@77",	"93 Kenny Hill",	"93150",	"Kuching",	"Sarawak",	"Malaysia",	"ahmdbk@gmail.com",	"0169938891"),
    (15, "Rose Zaibol",	"rossm073",	"fVdop@127",	"70 Kenny Hill",	"93150",	"Kuching",	"Sarawak",	"Malaysia",	"rosez@gmail.com",	"0167654899"),
    (16, "Chris Chin",	"pandas99",	"Gundam@22",	"400 Kenny Hill",	"93150",	"Kuching",	"Sarawak",	"Malaysia",	"cchin@gmail.com",	"0160399678"),
    (17, "Asmah Sali",	"hasma20",	"NPLioo@90",	"32 Gersik",	"93350",	"Kuching",	"Sarawak",	"Malaysia",	"asmah@gmail.com",	"0167956802"),
    (18, "Lara Wilson",	"lcroft400",	"fuRRy@70",	"24 Sejingkat",	"93350",	"Kuching",	"Sarawak",	"Malaysia",	"laraw@gmail.com",	"0162103587"),
    (19, "Pheobe Olson",	"coffee19",	"Blackie@79",	"542 Kenny Hill",	"93350", "Kuching",	"Sarawak",	"Malaysia",	"pheb@gmail.com",	"0167586072"),
    (20, "Wong Lei Mei",	"wngcl10",	"Hartmn@80",	"90 Digital Villa",	"93350", "Kuching",	"Sarawak",	"Malaysia",	"lww@gmail.com",	"0169882058"),
    (21, "Qash Zulkipli",	"pwrqsh90",	"mErsk@22",	"27 Digital Villa",	"93350",	"Kuching",	"Sarawak",	"Malaysia",	"qashz@gmail.com",	"0162047697")

    
    as new_data
    on duplicate key update
      name=new_data.name,	
      username=new_data.username,	
      password=new_data.password,	
      address=new_data.address,	
      postal_code=new_data.postal_code,	
      city=new_data.city,	
      state=new_data.state,	
      country=new_data.country,	
      email=new_data.email,
      phone_num=new_data.phone_num

`
  );
};
