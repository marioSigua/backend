const tableNames = require("../../lib/constants/tablenames");
const bcrypt = require("bcrypt");
const pass = bcrypt.hashSync("Password1", 10);

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(tableNames.accounts_tbl)
    .del()
    .then(function () {
      // Inserts seed entries
      return knex(tableNames.accounts_tbl).insert([
        {
          email: "admin@email.com",
          password: pass,
          firstname: "Mario",
          lastname: "Sigua",
          type: "Admin",
          isActive: 1,
          academic_year: "2020-2021",
        },

        {
          email: "mario.sigua.12@gmail.com",
          password: pass,
          firstname: "Mario",
          lastname: "Sigua",
          type: "Professor",
          isActive: 1,
          academic_year: "2020-2021",
        },

        {
          email: "mariosigua@ymail.com",
          password: pass,
          type: "Professor",
          firstname: "Vincent",
          lastname: "Gorospe",
          academic_year: "2020-2021",
        },

        {
          email: "mario_sigua@yahoo.com",
          password: pass,
          type: "Professor",
          firstname: "David",
          lastname: "Argarin",
          academic_year: "2020-2021",
        },

        {
          email: "kamotebayan@yahoo.com",
          password: pass,
          type: "Professor",
          firstname: "Carlo",
          lastname: "Isidro",
          academic_year: "2020-2021",
        },

        {
          email: "itsshowtime@yahoo.com",
          password: pass,
          firstname: "Kinfai",
          type: "Professor",
          lastname: "Aaron",
          academic_year: "2020-2021",
        },

        {
          email: "fuckdu30@yahoo.com",
          password: pass,
          type: "Professor",
          firstname: "Pau",
          lastname: "Briones",
          academic_year: "2020-2021",
        },

        {
          email: "harrypotter@yahoo.com",
          password: pass,
          type: "Professor",
          firstname: "Kevin",
          lastname: "Crisolo",
          academic_year: "2020-2021",
        },
      ]);
    });
};
