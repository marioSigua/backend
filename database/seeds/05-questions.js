const tablenames = require('../../lib/constants/tablenames')

exports.seed = function (knex) {
      // Deletes ALL existing entries
      return knex(tablenames.questions_tbl)
            .del()
            .then(function () {
                  // Inserts seed entries
                  return knex(tablenames.questions_tbl).insert([
                        {
                              form_title: 'what is the world',
                              question_form: JSON.stringify({
                                    type: 'identification',
                                    question: 'what is kamote',
                                    student_answer: 'hindi ko alam sir',
                              }),
                              student_id: 1,
                              subject_code: 'CMPE563',
                        },

                        {
                              form_title: 'sino si papa mo',
                              question_form: JSON.stringify({
                                    a: 'tangina',
                                    b: 'bubub',
                              }),

                              student_id: 1,
                              subject_code: 'CMPE563',
                        },

                        {
                              form_title: 'sino pinakamalaks sa earth  ',
                              question_form: JSON.stringify({
                                    a: 'tangina',
                                    b: 'bubub',
                              }),

                              student_id: 1,
                              subject_code: 'CMPE563',
                        },
                  ])
            })
}
