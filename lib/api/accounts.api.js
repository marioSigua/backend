const express = require("express");
const AccountModel = require("../../database/models/accounts.model");

const bcrypt = require("bcrypt");
const jwt = require("../token/jwt");

const router = express.Router();

router.post("/accounts/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    //promise to
    const account = await AccountModel.query().findOne({ email: email });
    if (!account) throw new Error("email is not registered");
    //promise to
    const checkPass = await bcrypt.compareSync(password, account.password);
    if (!checkPass) throw new Error("wrong password");

    //promise to
    const token = await jwt.sign({ id: account.account_id });
    if (account && checkPass) {
      res.status(200).json({
        name: `${account.account_type}-${account.account_id}`,
        token: token,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/accounts/signup", async (req, res, next) => {
  const { email, password, account_type } = req.body;
  try {
    const account = await AccountModel.query().findOne({ email: email });
    if (account) throw new Error("email is already registered");
    const pass = bcrypt.hashSync(password, 10);
    await AccountModel.query().insert({
      email: email,
      password: pass,
      account_type: account_type,
    });
    res.status(200).json("ok");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
