const tableNames = require('../../lib/constants/tablenames')
const { Model } = require('objection')

class StudentModel extends Model {
     static get tableName() {
          return tableNames.students_tbl
     }

     static get idColumn() {
          return 'student_id'
     }

     static get relationMappings() {
          const EnrolledSubjs = require('./enrolled_students.model')
          const QuestionsModel = require('./questions.model')
          return {
               EnrolledSubjects: {
                    relation: Model.HasOneRelation,
                    modelClass: EnrolledSubjs,

                    join: {
                         from: this.tableName + '.student_id',

                         to: tableNames.enrolled_subjects + '.student_id',
                    },
               },

               StudentsResponse: {
                    relation: Model.HasOneRelation,
                    modelClass: StudentsModel,

                    join: {
                         from: this.tableName + '.student_id',

                         to: tableNames.students_tbl + '.student_id',
                    },
               },
          }
     }
}

module.exports = StudentModel
