const tablenames = require("../../lib/constants/tablenames");

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(tablenames.enrolled_subjects)
    .del()
    .then(function () {
      // Inserts seed entries
      return knex(tablenames.enrolled_subjects).insert([]);
    });
};
