const tableNames = require("../../lib/constants/tablenames");

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(tableNames.students_tbl)
    .del()
    .then(function () {
      // Inserts seed entries
      return knex(tableNames.students_tbl).insert([
        {
          student_id: 1,
          firstname: "bobo",
          lastname: "oo",
          student_course: "BShit",
          student_grade: "",
        },
        {
          student_id: 2,
          firstname: "tanga",
          lastname: "ikaw",
          student_course: "aaaa",
          student_grade: "",
        },
        {
          student_id: 3,
          firstname: "inutil",
          lastname: "po",
          student_course: "sssss",
          student_grade: "",
        },
      ]);
    });
};
