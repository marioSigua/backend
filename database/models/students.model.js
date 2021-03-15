const tableNames = require("../../lib/constants/tablenames");
const { Model } = require("objection");

class StudentModel extends Model {
  static get tableName() {
    return tableNames.students_tbl;
  }

  static get idColumn() {
    return "student_id";
  }
}

module.exports = StudentModel;
