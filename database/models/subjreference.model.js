const tableNames = require("../../lib/constants/tablenames");
const { Model } = require("objection");

class SubjectReference extends Model {
  static get tableName() {
    return tableNames.subject_reference;
  }

  static get idColumn() {
    return "ref_id";
  }
}

module.exports = SubjectReference;
