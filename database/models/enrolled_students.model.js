const tableNames = require('../../lib/constants/tablenames')
const { Model } = require('objection')

class EnrolledStudents extends Model {
      static get tableName() {
            return tableNames.enrolled_subjects
      }

      static get idColumn() {
            return 'enrolled_id'
      }

      static get relationMappings() {
            const StudentModel = require('./students.model')

            return {
                  EnrolledStudents: {
                        relation: Model.HasManyRelation,
                        modelClass: StudentModel,

                        join: {
                              from: this.tableName + '.student_id',

                              to: tableNames.enrolled_subjects + '.student_id',
                        },
                  },
            }
      }
}

module.exports = EnrolledStudents
