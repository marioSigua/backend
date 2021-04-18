const tablenames = require('../../lib/constants/tablenames')

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex(tablenames.enrolled_subjects)
        .del()
        .then(function () {
            // Inserts seed entries
            return knex(tablenames.enrolled_subjects).insert([
                {
                    student_id: 1,
                    subject_code: 'CMPE563',
                    current_sem: '2nd SEMESTER',
                    school_year: '2020-2021',
                    isDropped: 0,
                },

                {
                    student_id: 2,
                    subject_code: 'CMPE563',
                    current_sem: '2nd SEMESTER',
                    school_year: '2020-2021',

                    isDropped: 0,
                },

                {
                    student_id: 3,
                    subject_code: 'CMPE563',
                    current_sem: '2nd SEMESTER',
                    school_year: '2020-2021',
                    isDropped: 0,
                },

                {
                    student_id: 4,
                    subject_code: 'CMPE563',
                    current_sem: '2nd SEMESTER',
                    school_year: '2020-2021',
                    isDropped: 0,
                },

                {
                    student_id: 5,
                    subject_code: 'CMPE563',
                    current_sem: '2nd SEMESTER',
                    school_year: '2020-2021',
                    isDropped: 0,
                },

                {
                    student_id: 6,
                    subject_code: 'CMPE563',
                    current_sem: '2nd SEMESTER',
                    school_year: '2020-2021',
                    isDropped: 0,
                },

                {
                    student_id: 7,
                    subject_code: 'CMPE563',
                    current_sem: '2nd SEMESTER',
                    school_year: '2020-2021',
                    isDropped: 0,
                },
            ])
        })
}
