require("dotenv").config();

const express = require("express");

const app = express();

const cors = require("cors");

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "kalil" });
});

const middlewares = require("./middlewares/errorhandler");

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const PORT = process.env.PORT || 5115;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
