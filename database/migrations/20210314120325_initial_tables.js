const tableNames = require('../../lib/constants/tablenames')
const Knex = require('knex')
/**
 *
 * @param {Knex} knex
 */
exports.up = async function (knex) {
      await knex.schema.createTable(tableNames.accounts_tbl, function (table) {
            table.increments('account_id').notNullable()
            table.string('email')
            table.string('password')
            table.string('account_type')
            table.timestamps(true, true)
      })

      await knex.schema.createTable(tableNames.students_tbl, function (table) {
            table.string('student_id').notNullable()
            table.string('firstname')
            table.string('lastname')
            table.string('student_course')
            table.double('student_grade')
            table.timestamps(true, true)
      })

      await knex.schema.createTable(tableNames.subjects_tbl, function (table) {
            table.string('subject_code').notNullable()
            table.string('subject_name')
            table.string('subject_desc')
            table.string('subject_term')
            table.string('subject_course')
            table.timestamps(true, true)
      })

      await knex.schema.createTable(
            tableNames.enrolled_subjects,
            function (table) {
                  table.increments('enrolled_id').notNullable()

                  table.string('student_id')
                        .unsigned()
                        .references('student_id')
                        .inTable(tableNames.students_tbl)
                        .onDelete('CASCADE')
                        .index()

                  table.string('subject_code')
                        .unsigned()
                        .references('subject_code')
                        .inTable(tableNames.subjects_tbl)
                        .onDelete('CASCADE')
                        .index()

                  table.dobule('prelim_grade', 2)
                  table.dobule('midterm_grade', 2)
                  table.dobule('finals_grade', 2)
                  table.string('current_sem')
                  table.string('school_year')
                  table.timestamps(true, true)
            }
      )
}
/**
 *
 * @param {Knex} knex
 */
exports.down = async function (knex) {
      await knex.schema.dropTableIfExists(tableNames.enrolled_subjects)
      await knex.schema.dropTableIfExists(tableNames.subjects_tbl)
      await knex.schema.dropTableIfExists(tableNames.students_tbl)
      await knex.schema.dropTableIfExists(tableNames.accounts_tbl)
}
