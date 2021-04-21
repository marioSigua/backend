const tableNames = require('../../lib/constants/tablenames')
const { Model } = require('objection')

class ResponseModel extends Model {
     static get tableName() {
          return tableNames.response_tbl
     }

     static get idColumn() {
          return 'response_id'
     }

     static get relationMappings() {
          const StudentsModel = require('./students.model')
          return {}
     }
}

module.exports = ResponseModel
