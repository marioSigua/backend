const express = require("express");
const StudentModel = require("../../database/models/students.model");

const jwt = require("../token/jwt");
const EnrolledStudents = require("../../database/models/enrolled_students.model");
const SubjectModel = require("../../database/models/subjects.model");
const QuestionModel = require("../../database/models/questions.model");
const router = express.Router();
const ResponseModel = require("../../database/models/student_response.model");
const { subjects_tbl } = require("../constants/tablenames");
const { sendMail, mailOptions } = require("../mailer/mailer");
const EmailStatus = require("../../database/models/email.model");

router.get("/list/students/:subject_code", async (req, res, next) => {
  const { subject_code } = req.params;

  try {
    // uncomment niyo pag my flow na yung login
    // const auth = req.headers['authorization']
    // if (!auth) throw new Error('No auth provided')
    // const decoded = await jwt.verify(auth)
    // if (!decoded) throw new Error('No Token Provided')
    const listStudents = await StudentModel.query()
      .withGraphJoined("EnrolledSubjects")
      .select(
        "firstname",
        "lastname",
        "student_email",
        "students_tbl.student_id",
        "EnrolledSubjects.created_at"
      )
      .where("EnrolledSubjects.subject_code", subject_code);
    res.status(200).json(listStudents);
  } catch (error) {
    next(error);
  }
});

router.get("/list/all/students", async (req, res, next) => {
  const { search } = req.query;
  try {
    // uncomment niyo pag my flow na yung login
    // const auth = req.headers['authorization']
    // if (!auth) throw new Error('No auth provided')
    // const decoded = await jwt.verify(auth)
    // if (!decoded) throw new Error('No Token Provided')
    const listStudents = await StudentModel.query().modify((list) => {
      if (search) {
        list.where("firstname", "like", `%${search}%`);
      }
    });

    res.status(200).json(listStudents);
  } catch (error) {
    next(error);
  }
});

router.get("/list/subjects", async (req, res, next) => {
  try {
    // uncomment niyo pag my flow na yung login
    // const auth = req.headers['authorization']
    // if (!auth) throw new Error('No auth provided')
    // const decoded = await jwt.verify(auth)
    // if (!decoded) throw new Error('No Token Provided')

    const subjects = await SubjectModel.query().where("isOccupied", 0);

    res.status(200).json(subjects);
  } catch (error) {
    next(error);
  }
});

router.get("/subjectGrade/listGrade", async (req, res, next) => {
  const { student_id, created_at, subject_code, term } = req.query;

  try {
    // uncomment niyo pag my flow na yung login
    // const auth = req.headers['authorization']
    // if (!auth) throw new Error('No auth provided')
    // const decoded = await jwt.verify(auth)
    // if (!decoded) throw new Error('No Token Provided')

    const subjects = await EnrolledStudents.query().modify((list) => {
      if (term === "Prelims") {
        list
          .select("prelim_grade")
          .where("student_id", student_id)
          .andWhere("created_at", created_at)
          .andWhere("subject_code", subject_code);
      } else if (term === "Midterm") {
        list
          .select("midterm_grade")
          .where("student_id", student_id)
          .andWhere("created_at", created_at)
          .andWhere("subject_code", subject_code);
      } else {
        list
          .select("finals_grade")
          .where("student_id", student_id)
          .andWhere("created_at", created_at)
          .andWhere("subject_code", subject_code);
      }
    });

    let responses = await QuestionModel.query()
      .withGraphJoined("studentResponse")
      .where("questions_tbl.term", term)
      .andWhere("questions_tbl.exam_purpose", "Exam")
      .andWhere("studentResponse.student_id", student_id);

    let examScore = 0,
      examTotal = 0;
    for (const outer of responses) {
      examTotal += parseInt(outer.question_score);
      for (const item of outer.studentResponse) {
        if (outer.form_number === item.form_number) {
          examScore += item.student_score;
        }
      }
    }

    let quizResponse = await QuestionModel.query()
      .withGraphJoined("studentResponse")
      .where("questions_tbl.term", term)
      .andWhere("questions_tbl.exam_purpose", "Quiz")
      .andWhere("studentResponse.student_id", student_id);

    let quizScore = 0,
      quizTotal = 0;
    for (const outer of quizResponse) {
      quizTotal += parseInt(outer.question_score);
      for (const item of outer.studentResponse) {
        if (outer.form_number === item.form_number) {
          quizScore += item.student_score;
        }
      }
    }

    let merge = {
      grade: subjects[0],
      exam: {
        score: examScore,
        total: examTotal,
      },
      quiz: {
        score: quizScore,
        total: quizTotal,
      },
    };

    res.status(200).json(merge);
  } catch (error) {
    next(error);
  }
});

router.get("/student/question/:token/:student_id", async (req, res, next) => {
  const { token, student_id } = req.params;
  try {
    const decoded = await jwt.verify(token);
    if (student_id) {
      const decodedStudentId = await jwt.verify(student_id);

      const ifResponded = await ResponseModel.query()
        .where("batch_number", decoded.id)
        .andWhere("student_id", decodedStudentId.id);

      if (ifResponded.length > 0) throw new Error("You already have submitted");
    }

    const questions = await QuestionModel.query().where(
      "batch_number",
      decoded.id
    );

    const questData = questions.map((k) => {
      return {
        batch_number: k.batch_number,
        form_number: k.form_number,
        type: k.type,
        format: k.format,
        topic: k.topic,
        term: k.term,
        student_answer: k.student_answer,
        form_answer: k.form_answer,
        question_score: k.question_score,

        question_type: k.question_type ? k.question_type : null,

        question: k.question ? JSON.parse(k.question) : null,

        choices: k.choices ? JSON.parse(k.choices) : null,
        subject_code: k.subject_code,
      };
    });

    res.status(200).json(questData);
  } catch (error) {
    next(error);
  }
});

router.get("/student/response/:token", async (req, res, next) => {
  const { token } = req.params;
  try {
    const decoded = await jwt.verify(token);

    const questions = await QuestionModel.query().where(
      "batch_number",
      decoded.id
    );

    const questData = questions.map((k) => {
      return {
        batch_number: k.batch_number,
        form_number: k.form_number,
        type: k.type,
        format: k.format,
        question_score: k.question_score,
        topic: k.topic,
        term: k.term,
        form_answer: k.form_answer,
        question_type: k.question_type ? k.question_type : null,

        question: k.question ? JSON.parse(k.question) : null,
        choices: k.choices ? JSON.parse(k.choices) : null,
        subject_code: k.subject_code,
      };
    });

    res.status(200).json(questData);
  } catch (error) {
    next(error);
  }
});

router.get("/exam/topics", async (req, res, next) => {
  try {
    const questions = await QuestionModel.query();

    const questData = questions.map((k) => {
      return {
        batch_number: k.batch_number,
        form_number: k.form_number,
        description: k.description,
        type: k.type,
        topic: k.topic,
        term: k.term,
        question_score: k.question_score,
        form_answer: k.form_answer,
        question_type: k.question_type ? k.question_type : null,

        question: k.question ? JSON.parse(k.question) : null,

        choices: k.choices ? JSON.parse(k.choices) : null,
        subject_code: k.subject_code,
      };
    });

    res.status(200).json(questData);
  } catch (error) {
    next(error);
  }
});

router.get("/exam/history", async (req, res, next) => {
  const { subject_code } = req.query;

  try {
    const questions = await QuestionModel.query()
      .where("subject_code", subject_code)
      .groupBy("batch_number");

    const questData = await Promise.all(
      questions.map(async (k) => {
        const token = await jwt.sign({ id: k.batch_number });
        return {
          url: token,
          term: k.term,
          batch_number: k.batch_number,
          subject_code: k.subject_code,
          date_end: k.date_end,
          time_end: k.time_end,
          exam_purpose: k.exam_purpose,
        };
      })
    );

    const studentResponse = await ResponseModel.query()
      .select("*")
      .where("subject_code", subject_code)
      .groupBy("batch_number")
      .groupBy("student_id")
      .sum({ score: "student_score" });

    const emailStat = await EmailStatus.query().where(
      "subject_code",
      subject_code
    );

    const responseData = await Promise.all(
      studentResponse.map(async (k) => {
        const student_token = await jwt.sign({ id: k.student_id });
        return {
          student_id: k.student_id,
          student_token: student_token,
          score: k.score,
          batch_number: k.batch_number,
          subject_code: k.subject_code,
          isTaken: true,
        };
      })
    );

    const merge = {
      history: questData,
      studentResponse: responseData,
      emailStatus: emailStat,
    };

    res.status(200).json(merge);
  } catch (error) {
    next(error);
  }
});

router.get("/assigned/subjects", async (req, res, next) => {
  try {
    const auth = req.headers["authorization"];
    if (!auth) throw new Error("no auth");
    const decoded = await jwt.verify(auth);
    if (!decoded) throw new Error("Wrong token format");

    const subjects = await SubjectModel.query().where("account_id", decoded.id);

    res.status(200).json(subjects);
  } catch (error) {
    next(error);
  }
});

router.get("/enrolled/students", async (req, res, next) => {
  try {
    const auth = req.headers["authorization"];
    if (!auth) throw new Error("no auth");
    const decoded = await jwt.verify(auth);
    if (!decoded) throw new Error("Wrong token format");

    const students = await SubjectModel.query()
      .withGraphJoined("students")
      .where("account_id", decoded.id)
      .andWhere("current_year", new Date().getFullYear())
      .andWhere("isOccupied", 1);

    res.status(200).json(students);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/viewing/student/form/:token/:student_id",
  async (req, res, next) => {
    const { token, student_id } = req.params;
    try {
      const decodedBatch = await jwt.verify(token);
      const decodedId = await jwt.verify(student_id);

      const studentProfile = await StudentModel.query().findById(decodedId.id);

      const responses = await QuestionModel.query()
        .withGraphJoined("studentResponse")
        .select(
          "questions_tbl.batch_number",
          "questions_tbl.form_number",
          "type",
          "topic",
          "term",
          "question_type",
          "question",
          "question_score",
          "form_answer",
          "studentResponse.student_score",
          "choices"
        )
        .where("questions_tbl.batch_number", decodedBatch.id)
        .andWhere("studentResponse.student_id", decodedId.id);

      const list = [];

      for (const o of responses) {
        for (const i of o.studentResponse) {
          if (o.form_number === i.form_number) {
            list.push({
              batch_number: o.batch_number,
              form_number: i.form_number,
              type: o.type,
              format: o.format,
              topic: o.topic,
              term: o.term,
              question_type: o.question_type,
              question_score: o.question_score,
              question: JSON.parse(o.question),
              form_answer: o.form_answer,
              student_score: i.student_score,
              choices: JSON.parse(o.choices),
              student_answer: i.student_answer,
            });
          }
        }
      }

      const merge = {
        profile: studentProfile,
        list: list,
      };
      res.status(200).json(merge);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/test", async (req, res, next) => {
  try {
    const arr = [
      "caliljaudiannn@gmail.com",
      "caliljaudiannnn@gmail.com",
      "mario.sigua.12@gmail.com",
      "vincentgorospe221@gmail.com",
      "col.2014010566@lsb.edu.ph",
      "col.2014010230@lsb.edu.ph",
    ];

    let mailOptions = {
      from: "lsbengineering@scanolongapo.com",
      to: "",
      subject: "Question Form",
      text: "Hello world horse", // plaintext body
      html: "",
    };

    let isFinished;
    const isOk = await Promise.all(
      arr.map(async (k) => {
        mailOptions.html = `<a href="https://lsb.scanolongapo.com/student/question/form">Testing</a>`;
        // mailOptions.html = `<h1>Take Exam</h1>`
        mailOptions.to = k;

        isFinished = await sendMail(mailOptions);

        return isFinished;
      })
    );

    res.status(200).json(isOk);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
