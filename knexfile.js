// Update with your config settings.
//connection ng nodejs sa xampp yung client yan yung gagamitin na db
// host ilagay nyo sa .env yung variable na DB_HOST dapat yan localhost or depende sa port ng gamit niyo
// properties na migrations jan pupunta yung ggawin niyo na migrations yung migration table yon
// yung seed test data yan lalgyan nya ng mga laman yung table.
require("dotenv").config();

module.exports = {
  // development: {
  //      client: 'mysql',
  //      connection: {
  //           //host: process.env.DB_HOST,
  //           host: 'localhost',
  //           database: 'thesisdb',
  //           user: 'root',
  //           pass: '',
  //           // user: 'cliljdn',
  //           // password: 'jaudian29',
  //           timezone: 'UTC',
  //           dateStrings: true,
  //      },
  //      pool: {
  //           min: 2,
  //           max: 10,
  //      },
  //      migrations: {
  //           directory: './database/migrations',
  //      },
  //      seeds: {
  //           directory: './database/seeds',
  //      },
  // },

  production: {
    client: "mysql",
    connection: {
      host: process.env.DB_HOST,
      database: "thesisdb",
      user: "mario123",
      password: "Password1",
      timezone: "UTC",
      dateStrings: true,
    },

    pool: {
      min: 2,
      max: 10,
    },

    migrations: {
      tableName: "knex_migrations",
    },
  },
};
