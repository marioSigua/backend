const tableNames = require('../../lib/constants/tablenames')
const { Model } = require('objection')

class SubjectModel extends Model {
      static get tableName() {
            return tableNames.subjects_tbl
      }

      static get idColumn() {
            return 'subject_code'
      }
}

module.exports = SubjectModel
