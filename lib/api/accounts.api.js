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
const tablenames = require('../constants/tablenames')

const knexfile = require('../../knexfile')
const Knex = require('knex')
const { Model, ref } = require('objection')
const { response_tbl } = require('../constants/tablenames')
const knex = Knex(knexfile.development)

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
                    name: `${account.firstname}-${account.account_id}`,
                    token: token,
                    profile: {
                         firstname: account.firstname,
                         lastname: account.lastname,
                    },
               })
          }
     } catch (error) {
          next(error)
     }
})

router.post('/accounts/signup', async (req, res, next) => {
     const { email, password } = req.body
     try {
          const account = await AccountModel.query().findOne({ email: email })
          if (account) throw new Error('email is already registered')

          const pass = bcrypt.hashSync(password, 10)
          await AccountModel.query().insert({
               email: email,
               password: pass,
          })
          res.status(200).json('ok')
     } catch (error) {
          next(error)
     }
})

router.patch('/subjectGrade/students', async (req, res, next) => {
     const { totalGrade, date_created, student_id, term } = req.body
     try {
          await EnrolledStudents.query()
               .where('student_id', student_id)
               .andWhere('created_at', date_created)
               .modify((list) => {
                    if (term == 'Prelims') {
                         list.patch({
                              prelim_grade: totalGrade,
                         })
                    } else if (term == 'Midterm') {
                         list.patch({
                              midterm_grade: totalGrade,
                         })
                    } else {
                         list.patch({
                              finals_grade: totalGrade,
                         })
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
          if (k.type === 'essay') {
               return {
                    batch_number: batch_number,
                    form_number: k.form_number,
                    description: '',
                    type: k.type,
                    topic: k.topic,
                    question_score: k.question_score,
                    term: term,
                    question_type: k.question_type ? k.question_type : null,

                    question: k.question ? JSON.stringify(k.question) : null,
                    subject_code: subject_code,
               }
          } else if (k.type === 'identification') {
               return {
                    batch_number: batch_number,
                    form_number: k.form_number,
                    type: k.type,
                    description: '',
                    topic: k.topic,
                    term: term,
                    question_score: k.question_score,
                    form_answer: k.form_answer,
                    question_type: k.question_type ? k.question_type : null,

                    question: k.question ? JSON.stringify(k.question) : null,
                    subject_code: subject_code,
               }
          } else {
               return {
                    batch_number: batch_number,
                    form_number: k.form_number,
                    type: k.type,
                    description: '',
                    topic: k.topic,
                    question_score: k.question_score,
                    term: term,
                    form_answer: k.form_answer,
                    question_type: k.question_type ? k.question_type : null,

                    question: k.question ? JSON.stringify(k.question) : null,

                    choices: k.choices ? JSON.stringify(k.choices) : null,
                    subject_code: subject_code,
               }
          }
     })

     try {
          const questData = await QuestionModel.query().insertGraph(
               dispatchData
          )

          if (questData) {
               let urlToken = await jwt.sign({ id: batch_number })
               const students = await StudentModel.query().whereIn(
                    'student_email',
                    JSON.parse(stdEmail)
               )
               let isFinished
               const isOk = await Promise.all(
                    students.map(async (k) => {
                         let studentToken = await jwt.sign({
                              id: k.student_id,
                         })

                         // mailOptions.html = `<a href="http://lsb.scanolongapo.com/student/question/form/${urlToken}/${studentToken}">click moko haha</a>`

                         mailOptions.html = `<a href="http://localhost:8080/student/question/form/${urlToken}/${studentToken}">Take Exam</a>`
                         mailOptions.to = k.student_email

                         isFinished = await sendMail(mailOptions)

                         return isFinished
                    })
               )

               if (isOk) res.status(200).json(questData)

               // JSON.parse(stdEmail).forEach(function (to, i, array) {
               //      mailOptions.to = to

               //      sendMail(mailOptions)
               // })
          }
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
          const subjectExist = await EnrolledStudents.query().findOne({
               student_id: student_id,
               subject_code: subject_code,
          })

          if (subjectExist)
               throw new Error(`Student is already added on the class`)

          const idExist = await StudentModel.query().findOne({
               student_id: student_id,
          })

          if (idExist) throw new Error(`Student ID already Exist `)

          const emailExist = await StudentModel.query().findOne({
               student_email: student_email,
          })

          if (emailExist) throw new Error(`Student Email already Exist `)

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
     const { student_id, created_at, subject_code } = req.body,
          student = {
               student_id,
               created_at,
               subject_code,
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
               .andWhere('subject_code', subject_code)
               .andWhere('created_at', created_at)
               .update(student)

          if (isSuccess) res.status(200).json(true)
     } catch (error) {
          next(error)
     }
})

router.post('/student/response', async (req, res, next) => {
     const { questionList } = req.body
     try {
          const deleteProp = {
               question: '',
               question_type: '',
               choices: '',
               form_answer: '',
               created_at: '',
               updated_at: '',
               topic: '',
               term: '',
               format: '',
               type: '',
               question_id: '',
               question_score: '',
          }

          const studentResponse = await Promise.all(
               questionList.map(async (k) => {
                    const decodeId = await jwt.verify(k.student_id)
                    Object.keys(deleteProp).forEach((ky) => delete k[ky])
                    return {
                         student_answer: k.student_answer,
                         student_score: k.student_score,
                         student_id: decodeId.id,
                         batch_number: k.batch_number,
                         form_number: k.form_number,
                         subject_code: k.subject_code,
                    }
               })
          )

          const isSuccess = await ResponseModel.query().insertGraph(
               studentResponse
          )

          if (isSuccess) res.status(200).json(true)
     } catch (error) {
          next(error)
     }
})

router.post('/resend/question', async (req, res, next) => {
     const { batch_number, stdEmail } = req.body

     try {
          const questData = await QuestionModel.query().findOne({
               batch_number: batch_number,
          })

          let finishedSending
          if (questData) {
               let urlToken = await jwt.sign({ id: batch_number })
               const students = await StudentModel.query().whereIn(
                    'student_email',
                    JSON.parse(stdEmail)
               )

               const isOk = await Promise.all(
                    students.map(async (k) => {
                         let studentToken = await jwt.sign({
                              id: k.student_id,
                         })

                         // mailOptions.html = `<a href="http://lsb.scanolongapo.com/student/question/form/${urlToken}/${studentToken}">Take Exam</a>`

                         mailOptions.html = `<a href="http://localhost:8080/student/question/form/${urlToken}/${studentToken}">Take Exam</a>`

                         mailOptions.to = k.student_email

                         finishedSending = await sendMail(mailOptions)
                         return finishedSending
                    })
               )

               if (isOk) res.status(200).json(true)
          }
     } catch (error) {
          next(error)
     }
})

router.patch('/essay/score', async (req, res, next) => {
     const { batch_token, id_token, formNumber, formList } = req.body
     console.log(req.body)
     try {
          const decodedID = await jwt.verify(id_token)
          const decodedBatch = await jwt.verify(batch_token)

          let isFinished

          isFinished = await ResponseModel.query()
               .where('batch_number', decodedBatch.id)
               .andWhere('student_id', decodedID.id)
               .whereIn('form_number', formNumber)

          let data = isFinished.map((k) => {
               let foundData = formList.find(
                    (el) => el.form_number === k.form_number
               )

               return {
                    student_answer: k.student_answer,
                    student_score: foundData ? foundData.student_score : '',
                    student_id: k.student_id,
                    subject_code: k.subject_code,
                    batch_number: k.batch_number,
                    form_number: k.form_number,
               }
          })

          await ResponseModel.query()
               .where('batch_number', decodedBatch.id)
               .andWhere('student_id', decodedID.id)
               .whereIn('form_number', formNumber)
               .delete()

          await ResponseModel.query().insertGraph(data)

          res.status(201).json('updated score')
     } catch (error) {
          next(error)
     }
})

module.exports = router
