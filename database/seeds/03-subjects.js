const tableNames = require("../../lib/constants/tablenames");

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(tableNames.subject_reference)
    .del()
    .then(function () {
      // Inserts seed entries
      return knex(tableNames.subject_reference).insert([
        {
          ref_id: "CMPE563",
          subject_name: "COE ELECTIVE 3: ONLINE TECH (LEC)",
          subject_year: "5th YEAR",
          subject_course: "BSCOE",
        },

        {
          ref_id: "CMPE563L",
          subject_name: "COE ELECTIVE 3: ONLINE TECH (LAB)",
          subject_year: "5th YEAR",
          subject_course: "BSCOE",
        },

        {
          ref_id: "CMPE523",
          subject_name: "MEMORY AND I/O SYSTEMS",
          subject_year: "5th YEAR",
          subject_course: "BSCOE",
        },

        {
          ref_id: "CMPE583",
          subject_name: "COE ELECTIVE 5: Current TECH",
          subject_year: "5th YEAR",
          subject_course: "BSCOE",
        },

        {
          ref_id: "CMPE583L",
          subject_name: "SAD",
          subject_year: "5th YEAR",
          subject_course: "BSCOE",
        },

        {
          ref_id: "CMPE51233",
          subject_name: "hahahaha",
          subject_year: "5th YEAR",
          subject_course: "BSCOE",
        },
      ]);
    });
};
