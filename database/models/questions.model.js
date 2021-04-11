const tableNames = require('../../lib/constants/tablenames')
const { Model } = require('objection')

class QuestionModel extends Model {
    static get tableName() {
        return tableNames.questions_tbl
    }

    static get idColumn() {
        return 'question_id'
    }

    // static columnNameMappers = {
    //       parse(obj) {
    //             // obj['question_form'] = JSON.parse(obj.question_form)
    //             // obj['student_response'] = JSON.parse(obj.student_response)

    //             return obj
    //       },

    //       format(obj) {
    //             // code --> database
    //       },
    // }

    static get relationMappings() {
        const StudentModel = require('./students.model')

        return {}
    }
}

module.exports = QuestionModel
