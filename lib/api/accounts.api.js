const express = require('express')
const AccountModel = require('../../database/models/accounts.model')

const bcrypt = require('bcrypt')
const jwt = require('../token/jwt')
const EnrolledStudents = require('../../database/models/enrolled_students.model')
const QuestionModel = require('../../database/models/questions.model')
const SubjectModel = require('../../database/models/subjects.model')
const { sendMail, mailOptions } = require('../mailer/mailer')
const StudentModel = require('../../database/models/students.model')
const ResponseModel = require('../../database/models/student_response.model')
var multer = require('multer')
var upload = multer({
     dest: 'uploads/',
     limits: { fieldSize: 25 * 1024 * 1024 },
})

const router = express.Router()

router.post('/accounts/login', async (req, res, next) => {
     const { email, password } = req.body
     try {
          //promise to
          const account = await AccountModel.query().findOne({ email: email })
          if (!account) throw new Error('email is not registered')
          //promise to
          const checkPass = await bcrypt.compareSync(password, account.password)
          if (!checkPass) throw new Error('wrong password')

          //promise to
          const token = await jwt.sign({ id: account.account_id })
          if (account && checkPass) {
               res.status(200).json({
                    name: `${account.account_type}-${account.account_id}`,
                    token: token,
                    profile: {
                         firstname: account.firstname,
                         lastname: account.lastname,
                         account_type: account.account_type,
                    },
               })
          }
     } catch (error) {
          next(error)
     }
})

router.post('/accounts/signup', async (req, res, next) => {
     const { email, password, account_type } = req.body
     try {
          const account = await AccountModel.query().findOne({ email: email })
          if (account) throw new Error('email is already registered')
          const pass = bcrypt.hashSync(password, 10)
          await AccountModel.query().insert({
               email: email,
               password: pass,
               account_type: account_type,
          })
          res.status(200).json('ok')
     } catch (error) {
          next(error)
     }
})

router.patch('/subjectGrade/students', async (req, res, next) => {
     const { totalGrade, date_created, student_id, term } = req.body
     try {
          await EnrolledStudents.query().modify((list) => {
               if (term == 'Prelims') {
                    list.patch({
                         prelim_grade: totalGrade,
                    })
                         .where('student_id', student_id)
                         .andWhere('created_at', date_created)
               } else if (term == 'Midterm') {
                    list.patch({
                         midterm_grade: totalGrade,
                    })
                         .where('student_id', student_id)
                         .andWhere('created_at', date_created)
               } else {
                    list.patch({
                         finals_grade: totalGrade,
                    })
                         .where('student_id', student_id)
                         .andWhere('created_at', date_created)
               }
          })
          res.status(200).json('grade updated!')
     } catch (error) {
          next(error)
     }
})
var cpUpload = upload.fields([
     { name: 'batch_number', maxCount: 8 },
     { name: 'term', maxCount: 8 },
     { name: 'question_form', maxCount: 8 },
     { name: 'subject_code', maxCount: 8 },
     { name: 'stdEmail', maxCount: 8 },
])
router.post('/create/form/questions', cpUpload, async (req, res, next) => {
     const {
          batch_number,
          term,
          question_form,
          subject_code,
          stdEmail,
     } = req.body
     const dispatchData = JSON.parse(question_form).map((k) => {
          if (k.type === 'Essay') {
               return {
                    batch_number: batch_number,
                    form_number: k.form_number,
                    type: k.type,
                    format: k.format,
                    topic: k.topic,
                    term: term,
                    question_text: k.question_text ? k.question_text : null,

                    question_image: k.question_image
                         ? JSON.stringify(k.question_image)
                         : null,
                    subject_code: subject_code,
               }
          } else if (k.type === 'Identification') {
               return {
                    batch_number: batch_number,
                    form_number: k.form_number,
                    type: k.type,
                    format: k.format,
                    topic: k.topic,
                    term: term,
                    form_answer: k.form_answer,
                    question_text: k.question_text ? k.question_text : null,

                    question_image: k.question_image
                         ? JSON.stringify(k.question_image)
                         : null,
                    subject_code: subject_code,
               }
          } else {
               return {
                    batch_number: batch_number,
                    form_number: k.form_number,
                    type: k.type,
                    format: k.format,
                    topic: k.topic,
                    term: term,
                    form_answer: k.form_answer,
                    question_text: k.question_text ? k.question_text : null,

                    question_image: k.question_image
                         ? JSON.stringify(k.question_image)
                         : null,

                    choices: k.choices ? JSON.stringify(k.choices) : null,
                    subject_code: subject_code,
               }
          }
     })

     try {
          const questData = await QuestionModel.query().modify((list) => {
               if (dispatchData.length > 0) {
                    list.insertGraph(dispatchData)
               }
          })

          if (questData) {
               let url = await jwt.sign({ id: batch_number })
               mailOptions.html = `<a href="http://localhost:8080/student/question/form/${url}">click moko haha</a>`
               JSON.parse(stdEmail).forEach(function (to, i, array) {
                    mailOptions.to = to

                    sendMail(mailOptions)
               })
          }
          res.status(200).json(questData)
     } catch (error) {
          next(error)
     }
})

router.patch('/add/prof/subjects', async (req, res, next) => {
     const { subject_code } = req.body

     try {
          const auth = req.headers['authorization']
          if (!auth) throw new Error('no auth')

          const decoded = await jwt.verify(auth)
          if (!decoded) throw new Error('Wrong token format')

          const isSuccess = await SubjectModel.query()
               .where('subject_code', subject_code)
               .patch({
                    account_id: decoded.id,
                    isOccupied: 1,
               })
          if (isSuccess) res.status(200).json(true)
     } catch (error) {
          next(error)
     }
})

router.post('/add/students', async (req, res, next) => {
     const {
               student_id,
               student_email,
               firstname,
               lastname,
               student_course,
               subject_code,
               subject_sem,
          } = req.body,
          student = {
               student_id,
               student_email,
               firstname,
               lastname,
               student_course,
          }

     try {
          // const auth = req.headers['authorization']
          // if (!auth) throw new Error('no auth')

          // const decoded = await jwt.verify(auth)
          // if (!decoded) throw new Error('Wrong token format')
          const isSuccess = await StudentModel.query().insert(student)
          const enrolledSubjects = await isSuccess
               .$relatedQuery('EnrolledSubjects')
               .insert({
                    current_sem: subject_sem,
                    subject_code: subject_code,
               })

          if (isSuccess && enrolledSubjects) res.status(200).json(true)
     } catch (error) {
          next(error)
     }
})

router.patch('/drop/students', async (req, res, next) => {
     const { student_id, created_at } = req.body,
          student = {
               student_id,
               created_at,

               //1 === true
               isDropped: 1,
          }

     try {
          // const auth = req.headers['authorization']
          // if (!auth) throw new Error('no auth')

          // const decoded = await jwt.verify(auth)
          // if (!decoded) throw new Error('Wrong token format')
          const isSuccess = await EnrolledStudents.query()
               .where('student_id', student_id)
               .andWhere('created_at', created_at)
               .patch(student)

          if (isSuccess) res.status(200).json(true)
     } catch (error) {
          next(error)
     }
})

router.post('/student/response', async (req, res, next) => {
     const { questionList } = req.body
     try {
          const isSuccess = await ResponseModel.query().insertGraph(
               questionList
          )

          if (isSuccess) res.status(200).json(true)
     } catch (error) {
          next(error)
     }
})

router.post('/resend/question', async (req, res, next) => {
     const { batch_number, stdEmail } = req.body

     console.log(req.body)
     try {
          const questData = await QuestionModel.query().findOne({
               batch_number: batch_number,
          })

          if (questData) {
               let url = await jwt.sign({ id: batch_number })
               mailOptions.html = `<a href="http://localhost:8080/student/question/form/${url}">click moko haha</a>`
               JSON.parse(stdEmail).forEach(function (to, i, array) {
                    mailOptions.to = to

                    sendMail(mailOptions)
               })
               res.status(200).json(true)
          }
     } catch (error) {
          next(error)
     }
})

module.exports = router
