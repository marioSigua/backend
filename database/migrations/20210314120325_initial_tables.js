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
          table.string('type')
          table.boolean('isActive').defaultTo(0)
          table.string('password')
          table.string('firstname').nullable()
          table.string('lastname').nullable()
          table.timestamps(true, true)
     })

     await knex.schema.createTable(tableNames.students_tbl, function (table) {
          table.string('student_id', 255).notNullable().primary()
          table.string('student_email')
          table.string('firstname')
          table.string('lastname')
          table.string('student_course')
     })

     await knex.schema.createTable(tableNames.subjects_tbl, function (table) {
          table.string('subject_code', 255).notNullable().primary()

          table.string('subject_name')
          table.string('subject_desc')
          table.string('subject_sem')
          table.string('subject_year')
          table.string('subject_course')

          //id ng prof
          table.integer('account_id')
               .unsigned()
               .references('account_id')
               .inTable(tableNames.accounts_tbl)
               .onDelete('CASCADE')
               .index()

          table.boolean('isOccupied').defaultTo(false)

          table.string('current_year').defaultTo(new Date().getFullYear())
          table.timestamps(true, true)
     })

     await knex.schema.createTable(
          tableNames.enrolled_subjects,
          function (table) {
               table.increments('enrolled_id').notNullable()
               table.float('prelim_grade')
               table.float('midterm_grade')
               table.float('finals_grade')
               table.string('current_sem')
               table.string('school_year')

               table.boolean('isDropped').defaultTo(false)

               table.string('student_id', 255)
                    .references('student_id')
                    .inTable(tableNames.students_tbl)
                    .index()

               table.string('subject_code', 255)
                    .references('subject_code')
                    .inTable(tableNames.subjects_tbl)
                    .index()

               table.timestamps(true, true)
          }
     )

     await knex.schema.createTable(tableNames.questions_tbl, function (table) {
          table.increments('question_id').notNullable()

          table.string('batch_number', 255)
          table.string('form_number', 255)
          table.specificType('description', 'longtext').nullable()
          table.string('question_score')
          table.string('type')
          table.string('exam_purpose')
          table.string('topic')
          table.string('term')
          table.string('question_type').nullable()
          table.jsonb('question').nullable()
          table.string('student_answer').nullable()

          table.jsonb('choices').nullable()
          table.string('form_answer')
          table.string('subject_code', 255)
               .references('subject_code')
               .inTable(tableNames.subjects_tbl)
               .index()

          table.time('time_end')
          table.date('date_end')
     })

     await knex.schema.createTable(tableNames.response_tbl, function (table) {
          table.increments('response_id').notNullable()

          table.specificType('student_answer', 'longtext').nullable()

          table.integer('student_score').nullable()

          table.string('student_id', 255)
               .references('student_id')
               .inTable(tableNames.students_tbl)
               .index()

          table.string('subject_code', 255)
               .references('subject_code')
               .inTable(tableNames.subjects_tbl)
               .index()

          table.string('batch_number', 255)
          table.string('form_number', 255)

          table.timestamps(true, true)
     })

     await knex.schema.createTable(tableNames.email_status, function (table) {
          table.increments('response_id').notNullable()

          table.string('batch_number', 255)

          table.string('student_id', 255)

          table.string('subject_code', 255)
               .references('subject_code')
               .inTable(tableNames.subjects_tbl)
               .index()

          table.timestamps(true, true)
     })
}

/**
 *
 * @param {Knex} knex
 */
exports.down = async function (knex) {
     await knex.schema.dropTableIfExists(tableNames.email_status)
     await knex.schema.dropTableIfExists(tableNames.response_tbl)
     await knex.schema.dropTableIfExists(tableNames.questions_tbl)
     await knex.schema.dropTableIfExists(tableNames.enrolled_subjects)
     await knex.schema.dropTableIfExists(tableNames.subjects_tbl)
     await knex.schema.dropTableIfExists(tableNames.students_tbl)
     await knex.schema.dropTableIfExists(tableNames.accounts_tbl)
}
