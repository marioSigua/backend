require("dotenv").config();

const express = require("express");

const app = express();

const cors = require("cors");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "kalil" });
});

const accountapi = require("./lib/api/accounts.api");

app.use("/api/p1", accountapi);

const listapi = require("./lib/api/list.api");

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
