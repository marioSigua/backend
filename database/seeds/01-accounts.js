const tableNames = require('../../lib/constants/tablenames')
const bcrypt = require('bcrypt')
const pass = bcrypt.hashSync('Password1', 10)

exports.seed = function (knex) {
      // Deletes ALL existing entries
      return knex(tableNames.accounts_tbl)
            .del()
            .then(function () {
                  // Inserts seed entries
                  return knex(tableNames.accounts_tbl).insert([
                        {
                              email: 'mario.sigua.12@gmail.com',
                              password: pass,
                              account_type: 'Student',
                        },

                        {
                              email: 'mariosigua@ymail.com',
                              password: pass,
                              account_type: 'Student',
                        },

                        {
                              email: 'mario_sigua@yahoo.com',
                              password: pass,
                              account_type: 'Student',
                        },

                        {
                              email: 'kamotebayan@yahoo.com',
                              password: pass,
                              account_type: 'Student',
                        },

                        {
                              email: 'itsshowtime@yahoo.com',
                              password: pass,
                              account_type: 'Student',
                        },

                        {
                              email: 'fuckdu30@yahoo.com',
                              password: pass,
                              account_type: 'Student',
                        },

                        {
                              email: 'harrypotter@yahoo.com',
                              password: pass,
                              account_type: 'Student',
                        },
                  ])
            })
}
