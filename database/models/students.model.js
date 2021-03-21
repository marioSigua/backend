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

            return {
                  EnrolledSubjects: {
                        relation: Model.HasOneRelation,
                        modelClass: EnrolledSubjs,

                        join: {
                              from: this.tableName + '.student_id',

                              to: tableNames.enrolled_subjects + '.student_id',
                        },
                  },
            }
      }
}

module.exports = StudentModel
