const tableNames = require('../../lib/constants/tablenames')
const { Model } = require('objection')

class ResponseModel extends Model {
     static get tableName() {
          return tableNames.response_tbl
     }

     static get idColumn() {
          return 'response_id'
     }
}

module.exports = ResponseModel
