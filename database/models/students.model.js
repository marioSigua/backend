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
            const SubjectsModel = require('./subjects.model')

            return {
                  EnrolledSubjects: {
                        relation: Model.ManyToManyRelation,
                        modelClass: SubjectsModel,

                        join: {
                              from: this.tableName + '.student_id',
                              through: {
                                    from:
                                          tableNames.enrolled_subjects +
                                          '.student_id',
                                    to:
                                          tableNames.enrolled_subjects +
                                          '.subject_code',
                              },
                              to: tableNames.subjects_tbl + '.subject_code',
                        },
                  },
            }
      }
}

module.exports = StudentModel
