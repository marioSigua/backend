const tableNames = require('../../lib/constants/tablenames')
const { Model } = require('objection')

class EmailStatus extends Model {
     static get tableName() {
          return tableNames.email_status
     }
}

module.exports = EmailStatus
