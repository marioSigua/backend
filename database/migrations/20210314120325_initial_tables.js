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
		table.string('student_grade')

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

	await knex.schema.createTable(tableNames.subjects_tbl, function (table) {
		table.string('subject_code').notNullable()
		table.string('subject_name')
		table.string('subject_desc')
		table.string('subject_term')
		table.string('subject_course')
		table.timestamps(true, true)
	})
}

exports.down = async function (knex) {
	await knex.schema.dropTableIfExists(tableNames.subjects_tbl)
	await knex.schema.dropTableIfExists(tableNames.students_tbl)
	await knex.schema.dropTableIfExists(tableNames.accounts_tbl)
}
