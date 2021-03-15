const express = require("express");
const StudentModel = require("../../database/models/students.model");

const router = express.Router();

router.get("/list/students", async (req, res, next) => {
  try {
    const list = await StudentModel.query();
    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
});

router.post("/list/students", async (req, res, next) => {
  const {
    student_id,
    firstname,
    lastname,
    student_course,
    student_grade,
  } = req.body;
  try {
    const list = await StudentModel.query().insert({
      // property: user input
      student_id: student_id,
      firstname: firstname,
      lastname: lastname,
      student_course: student_course,
      student_grade: student_grade,
    });
    res.status(200).json({ message: "ok" });
  } catch (error) {
    next(error);
  }
});

router.patch("/list/students", async (req, res, next) => {
  const {
    student_id,
    firstname,
    lastname,
    student_course,
    student_grade,
  } = req.body;
  try {
    const auth = req.headers["authorization"];
    if (!auth) throw new Error("no auth provided");
    const list = await StudentModel.query()
      .patch({
        // property: user input
        student_id: student_id,
        firstname: firstname,
        lastname: lastname,
        student_course: student_course,
        student_grade: student_grade,
      })
      .where("student_id", auth);
    res.status(200).json({ message: "updated" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
