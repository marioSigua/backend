const tableNames = require("../../lib/constants/tablenames");
const Knex = require("knex");

/**
 *
 * @param {Knex} knex
 */

exports.up = async function (knex) {
  await knex.schema.createTable(tableNames.accounts_table, function (table) {
    table.increments("account_id").notNullable();
    table.string("email");
    table.string("password");
    table.string("account_type");
    table.timestamps(true, true);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists(tableNames.accounts_table);
};
