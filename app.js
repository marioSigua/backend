require("dotenv").config();

const express = require("express");

const app = express();

const cors = require('cors')
const compression = require('compression')
const helmet = require('helmet')
app.use(express.json())
// {
//       limit: '50mb',
//  }
app.use(express.urlencoded({ extended: true }));

app.use(
     cors({
          'Access-Control-Allow-Origin': '*',
     })
)
app.use(helmet())
// const shouldCompress = (req, res) => {
//       if (req.headers['x-no-compression']) {
//             // don't compress responses if this request header is present
//             return false
//       }

//       // fallback to standard compression
//       return compression.filter(req, res)
// }
// {
//       // filter decides if the response should be compressed or not,
//       // based on the `shouldCompress` function above
//       filter: shouldCompress,
//       // threshold is the byte threshold for the response body size
//       // before compression is considered, the default is 1kb
//       threshold: 0,
// }

app.use(compression());

app.get("/", (req, res) => {
  res.json({ message: "kalil" });
});

const accountapi = require("./lib/api/accounts.api");
const listapi = require("./lib/api/list.api");

app.use("/api/p1", accountapi);
app.use("/api/p1", listapi);

const knexfile = require("./knexfile");
const Knex = require("knex");
const { Model } = require("objection");
const knex = Knex(knexfile.development);

Model.knex(knex);

const middlewares = require("./middlewares/errorhandler");

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const PORT = process.env.PORT || 5115;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
