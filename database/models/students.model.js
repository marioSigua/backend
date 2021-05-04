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

               studentResponse: {
                    relation: Model.ManyToManyRelation,
                    modelClass: QuestionsModel,

                    join: {
                         from: this.tableName + '.student_id',

                         to: tableNames.questions_tbl + '.batch_number',
                    },
               },
          }
     }
}

module.exports = StudentModel
