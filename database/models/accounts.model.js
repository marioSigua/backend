const tableNames = require('../../lib/constants/tablenames')
const { Model } = require('objection')

class AccountModel extends Model {
      static get tableName() {
            return tableNames.accounts_tbl
      }

      static get idColumn() {
            return 'account_id'
      }

      static get relationMappings() {
            const subjects = require('./subjects.model')

            return {
                  assignedSubjects: {
                        relation: Model.HasManyRelation,

                        modelClass: () => subjects,

                        join: {
                              from: this.tableName + '.account_id',
                              to: tableNames.subjects_tbl + '.account_id',
                        },
                  },
            }
      }
}

module.exports = AccountModel
