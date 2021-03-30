const tablenames = require('../../lib/constants/tablenames')

exports.seed = function (knex) {
      // Deletes ALL existing entries
      return knex(tablenames.questions_tbl)
            .del()
            .then(function () {
                  // Inserts seed entries
                  return knex(tablenames.questions_tbl).insert([
                        {
                              question_desc: 'what is the world',
                              question_choices: JSON.stringify([
                                    {
                                          a: 'tangina',
                                          b: 'bubub',
                                          c: '34 thousand',
                                    },
                              ]),
                              student_id: 1,
                              subject_code: 'CMPE563',
                        },

                        {
                              question_desc: 'sino si papa mo',
                              question_choices: JSON.stringify({
                                    a: 'tangina',
                                    b: 'bubub',
                              }),

                              student_id: 1,
                              subject_code: 'CMPE563',
                        },

                        {
                              question_desc: 'sino pinakamalaks sa earth  ',
                              question_choices: JSON.stringify({
                                    a: 'tangina',
                                    b: 'bubub',
                              }),

                              student_id: 1,
                              subject_code: 'CMPE563',
                        },
                  ])
            })
}
