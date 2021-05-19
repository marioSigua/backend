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
          student_email: "caliljaudiannn@gmail.com",
          firstname: "Joshua",
          lastname: "Kato",
          student_course: "BSIE",
        },
        //palitan mo pangalan
        // saan?

        {
          student_id: 2,
          firstname: "Rolly",
          student_email: "vincentgorospe221@gmail.com",
          lastname: "Santos",
          student_course: "BSECE",
        },

        {
          student_id: 3,
          firstname: "Monica",
          student_email: "caliljaudiannnn@gmail.com",
          lastname: "Kalaban",
          student_course: "BSECE",
        },

        {
          student_id: 4,
          firstname: "mario",
          student_email: "vincentgorospe25@gmail.com",
          lastname: "sigua",
          student_course: "BSECE",
        },

        {
          student_id: 5,
          firstname: "david",
          student_email: "mario.sigua.12@gmail.com",
          lastname: "argarini",
          student_course: "BSCpE",
        },

        {
          student_id: 6,
          firstname: "vincent",
          student_email: "davidargarin2104@gmail.com",
          lastname: "gorospe",
          student_course: "BSCpE",
        },

        {
          student_id: 7,
          firstname: "carlo",
          student_email: "carloisidroo@gmail.com",
          lastname: "isidro",
          student_course: "BSCpE",
        },
      ]);
    });
};
