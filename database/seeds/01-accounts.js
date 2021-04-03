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
                              firstname: 'Mario',
                              lastname: 'Sigua',
                              account_type: 'Professor',
                        },

                        {
                              email: 'mariosigua@ymail.com',
                              password: pass,
                              firstname: 'Vincent',
                              lastname: 'Gorospe',
                              account_type: 'Professor',
                        },

                        {
                              email: 'mario_sigua@yahoo.com',
                              password: pass,
                              firstname: 'David',
                              lastname: 'Argarin',
                              account_type: 'Professor',
                        },

                        {
                              email: 'kamotebayan@yahoo.com',
                              password: pass,
                              firstname: 'Carlo',
                              lastname: 'Isidro',
                              account_type: 'Professor',
                        },

                        {
                              email: 'itsshowtime@yahoo.com',
                              password: pass,
                              firstname: 'Kinfai',
                              lastname: 'Aaron',
                              account_type: 'Professor',
                        },

                        {
                              email: 'fuckdu30@yahoo.com',
                              password: pass,
                              firstname: 'Pau',
                              lastname: 'Briones',
                              account_type: 'Professor',
                        },

                        {
                              email: 'harrypotter@yahoo.com',
                              password: pass,
                              firstname: 'Kevin',
                              lastname: 'Crisolo',
                              account_type: 'Professor',
                        },
                  ])
            })
}
