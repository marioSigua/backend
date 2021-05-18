const tableNames = require('../../lib/constants/tablenames')

exports.seed = function (knex) {
     // Deletes ALL existing entries
     return knex(tableNames.subjects_tbl)
          .del()
          .then(function () {
               // Inserts seed entries
               return knex(tableNames.subjects_tbl).insert([
                    {
                         subject_code: 'CMPE563-A',
                         subject_name: 'COE ELECTIVE 3: ONLINE TECH (LEC)',
                         subject_desc: 'M W F 12:00-1:00',
                         subject_sem: '2nd SEMESTER',
                         subject_year: '5th YEAR',
                         subject_course: 'BSCOE',
                         account_id: 2,
                         isOccupied: 1,
                    },

                    {
                         subject_code: 'CMPE563-B',
                         subject_name: 'COE ELECTIVE 3: ONLINE TECH (LEC)',
                         subject_desc: 'M W F 12:00-1:00',
                         subject_sem: '2nd SEMESTER',
                         subject_year: '5th YEAR',
                         subject_course: 'BSCOE',
                    },

                    {
                         subject_code: 'CMPE563L-A',
                         subject_name: 'COE ELECTIVE 3: ONLINE TECH (LAB)',
                         subject_desc: 'M W F 2:00-3:00',
                         subject_sem: '2nd SEMESTER',
                         subject_year: '5th YEAR',
                         subject_course: 'BSCOE',
                         account_id: 2,
                         isOccupied: 1,
                    },

                    {
                         subject_code: 'CMPE563L-B',
                         subject_name: 'COE ELECTIVE 3: ONLINE TECH (LAB)',
                         subject_desc: 'M W F 2:00-3:00',
                         subject_sem: '2nd SEMESTER',
                         subject_year: '5th YEAR',
                         subject_course: 'BSCOE',
                    },

                    {
                         subject_code: 'CMPE523-A',
                         subject_name: 'MEMORY AND I/O SYSTEMS',
                         subject_desc: 'M W F 5:00-6:00',
                         subject_sem: '2nd SEMESTER',
                         subject_year: '5th YEAR',
                         subject_course: 'BSCOE',
                         account_id: 2,
                         isOccupied: 1,
                    },

                    {
                         subject_code: 'CMPE523-B',
                         subject_name: 'MEMORY AND I/O SYSTEMS',
                         subject_desc: 'M W F 5:00-6:00',
                         subject_sem: '2nd SEMESTER',
                         subject_year: '5th YEAR',
                         subject_course: 'BSCOE',
                    },

                    {
                         subject_code: 'CMPE583-A',
                         subject_name: 'COE ELECTIVE 5: Current TECH',
                         subject_desc: 'S 2:00-5:00',
                         subject_sem: '2nd SEMESTER',
                         subject_year: '5th YEAR',
                         subject_course: 'BSCOE',
                         account_id: 2,
                         isOccupied: 1,
                    },

                    {
                         subject_code: 'CMPE583-B',
                         subject_name: 'COE ELECTIVE 5: Current TECH',
                         subject_desc: 'S 2:00-5:00',
                         subject_sem: '2nd SEMESTER',
                         subject_year: '5th YEAR',
                         subject_course: 'BSCOE',
                    },

                    {
                         subject_code: 'CMPE583L-A',
                         subject_name: 'SAD',
                         subject_desc: 'M W F 5:00-6:00',
                         subject_sem: '2nd SEMESTER',
                         subject_year: '5th YEAR',
                         subject_course: 'BSCOE',
                         account_id: 2,
                         isOccupied: 1,
                    },

                    {
                         subject_code: 'CMPE583L-B',
                         subject_name: 'SAD',
                         subject_desc: 'M W F 5:00-6:00',
                         subject_sem: '2nd SEMESTER',
                         subject_year: '5th YEAR',
                         subject_course: 'BSCOE',
                    },

                    {
                         subject_code: 'CMPE51233-A',
                         subject_name: 'hahahaha',
                         subject_desc: 'S 2:00-5:00',
                         subject_sem: '2nd SEMESTER',
                         subject_year: '5th YEAR',
                         subject_course: 'BSCOE',
                         account_id: 2,
                         isOccupied: 1,
                    },

                    {
                         subject_code: 'CMPE51233-B',
                         subject_name: 'hahahaha',
                         subject_desc: 'S 2:00-5:00',
                         subject_sem: '2nd SEMESTER',
                         subject_year: '5th YEAR',
                         subject_course: 'BSCOE',
                    },
               ])
          })
}
