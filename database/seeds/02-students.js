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
                              firstname: 'bobo',
                              lastname: 'oo',
                              student_course: 'BSIE',
                              student_grade: '',
                        },

                        {
                              student_id: 2,
                              firstname: 'tanga',
                              lastname: 'ikaw',
                              student_course: 'BSECE',
                              student_grade: '',
                        },

                        {
                              student_id: 3,
                              firstname: 'inutil',
                              lastname: 'po',
                              student_course: 'BSECE',
                              student_grade: '',
                        },

                        {
                              student_id: 4,
                              firstname: 'mario',
                              lastname: 'sigua',
                              student_course: 'BSECE',
                              student_grade: '',
                        },

                        {
                              student_id: 5,
                              firstname: 'david',
                              lastname: 'argarini',
                              student_course: 'BSCpE',
                              student_grade: '',
                        },

                        {
                              student_id: 6,
                              firstname: 'vincent',
                              lastname: 'gorospe',
                              student_course: 'BSCpE',
                              student_grade: '',
                        },

                        {
                              student_id: 7,
                              firstname: 'carlo',
                              lastname: 'isidro',
                              student_course: 'BSCpE',
                              student_grade: '',
                        },
                  ])
            })
}
