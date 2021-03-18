const tableNames = require("../../lib/constants/tablenames");
const { Model } = require("objection");

class AccountModel extends Model {
  static get tableName() {
    return tableNames.accounts_tbl;
  }

  static get idColumn() {
    return "account_id";
  }
}

module.exports = AccountModel;
