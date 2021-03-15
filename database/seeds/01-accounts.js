const tableNames = require("../../lib/constants/tablenames");
const bcrypt = require("bcrypt");
const pass = bcrypt.hashSync("password", 10);

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(tableNames.accounts_tbl)
    .del()
    .then(function () {
      // Inserts seed entries
      return knex(tableNames.accounts_tbl).insert([
        { email: "mario.sigua.12@gmail.com", password: pass, account_type: "" },
        { email: "mariosigua@ymail.com", password: pass, account_type: "" },
        { email: "mario_sigua@yahoo.com", password: pass, account_type: "" },
      ]);
    });
};
