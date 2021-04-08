const tableNames = require('../../lib/constants/tablenames')

exports.seed = function (knex) {
      // Deletes ALL existing entries
      return knex(tableNames.students_tbl)
            .del()
            .then(function () {
                  // Inserts seed entries
                  return knex(tableNames.students_tbl).insert([
                        {
                              student_id: 1,
                              student_email: 'caliljaudiannn@gmail.com',
                              firstname: 'bobo',
                              lastname: 'oo',
                              student_course: 'BSIE',
                        },

                        {
                              student_id: 2,
                              firstname: 'tanga',
                              student_email: 'vincentgorospe221@gmail.com',
                              lastname: 'ikaw',
                              student_course: 'BSECE',
                        },

                        {
                              student_id: 3,
                              firstname: 'inutil',
                              student_email: 'caliljaudiannnn@gmail.com',
                              lastname: 'po',
                              student_course: 'BSECE',
                        },

                        {
                              student_id: 4,
                              firstname: 'mario',
                              student_email: 'caliljaudiannn@gmail.com',
                              lastname: 'sigua',
                              student_course: 'BSECE',
                        },

                        {
                              student_id: 5,
                              firstname: 'david',
                              student_email: 'mario.sigua.12@gmail.com',
                              lastname: 'argarini',
                              student_course: 'BSCpE',
                        },

                        {
                              student_id: 6,
                              firstname: 'vincent',
                              student_email: 'davidargarin2104@gmail.com',
                              lastname: 'gorospe',
                              student_course: 'BSCpE',
                        },

                        {
                              student_id: 7,
                              firstname: 'carlo',
                              lastname: 'isidro',
                              student_course: 'BSCpE',
                        },
                  ])
            })
}
