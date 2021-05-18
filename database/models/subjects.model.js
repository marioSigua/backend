const tableNames = require('../../lib/constants/tablenames')
const { Model } = require('objection')

class SubjectModel extends Model {
     static get tableName() {
          return tableNames.subjects_tbl
     }

     static get idColumn() {
          return 'subject_code'
     }

     static get relationMappings() {
          const StudentsModel = require('./students.model')
          const EnrolledStudents = require('./enrolled_students.model')
          const QuestionModel = require('./questions.model')

          return {
               students: {
                    relation: Model.ManyToManyRelation,
                    modelClass: () => StudentsModel,

                    join: {
                         from: this.tableName + '.subject_code',
                         through: {
                              from:
                                   tableNames.enrolled_subjects +
                                   '.subject_code',

                              to: tableNames.enrolled_subjects + '.student_id',

                              extra: [
                                   'prelim_grade',
                                   'midterm_grade',
                                   'finals_grade',
                                   'isDropped',
                                   'created_at',
                              ],
                         },
                         to: tableNames.students_tbl + '.student_id',
                    },
               },

               studentGrades: {
                    relation: Model.HasManyRelation,
                    modelClass: () => EnrolledStudents,
                    join: {
                         from: this.tableName + '.subject_code',

                         to: tableNames.enrolled_subjects + '.subject_code',
                    },
               },

               questionTopics: {
                    relation: Model.HasManyRelation,
                    modelClass: () => QuestionModel,
                    join: {
                         from: this.tableName + '.subject_code',

                         to: tableNames.questions_tbl + '.subject_code',
                    },
               },

               studentResponse: {
                    relation: Model.ManyToManyRelation,
                    modelClass: () => StudentsModel,

                    join: {
                         from: this.tableName + '.subject_code',
                         through: {
                              from: tableNames.response_tbl + '.subject_code',

                              to: tableNames.response_tbl + '.student_id',

                              extra: ['student_score', 'batch_number'],
                         },
                         to: tableNames.students_tbl + '.student_id',
                    },
               },

               SubjectsGrade: {
                    relation: Model.HasManyRelation,
                    modelClass: () => EnrolledStudents,
                    join: {
                         from: this.tableName + '.subject_code',

                         to: tableNames.enrolled_subjects + '.subject_code',
                    },
               },
          }
     }
}

module.exports = SubjectModel
