const express = require('express')
const AccountModel = require('../../database/models/accounts.model')

const bcrypt = require('bcrypt')
const jwt = require('../token/jwt')
const EnrolledStudents = require('../../database/models/enrolled_students.model')
const QuestionModel = require('../../database/models/questions.model')
const SubjectModel = require('../../database/models/subjects.model')
const { sendMail, sendIndiv } = require('../mailer/mailer')
const StudentModel = require('../../database/models/students.model')
const ResponseModel = require('../../database/models/student_response.model')
var multer = require('multer')
const tablenames = require('../constants/tablenames')

const knexfile = require('../../knexfile')
const Knex = require('knex')
const EmailStatus = require('../../database/models/email.model')

var upload = multer({
     dest: 'uploads/',
     limits: { fieldSize: 25 * 1024 * 1024 },
})

const router = express.Router()

router.post('/accounts/login', async (req, res, next) => {
     const { email, password } = req.body
     try {
          //promise to
          const account = await AccountModel.query().findOne({
               email: email,
               isActive: 1,
          })
          if (account !== undefined) {
               //promise to
               const checkPass = await bcrypt.compareSync(
                    password,
                    account.password
               )
               if (!checkPass) throw new Error('Wrong password')

               //promise to
               const token = await jwt.sign({ id: account.account_id })
               if (account && checkPass) {
                    res.status(200).json({
                         name: `${account.type}-${account.account_id}`,
                         type: account.type,
                         token: token,
                         profile: {
                              firstname: account.firstname,
                              lastname: account.lastname,
                         },
                    })
               }
          } else {
               throw new Error('Email is not registered')
          }
     } catch (error) {
          next(error)
     }
})

router.patch('/students/dropall', async (req, res, next) => {
     const { account_id } = req.body
     try {
          const subjects = await SubjectModel.query()
               .withGraphJoined('SubjectsGrade')
               .where('account_id', account_id)
               .patch({
                    isDropped: 0,
                    account_id: null,
                    isOccupied: 0,
               })

          console.log(subjects)

          res.status(200).json(subjects)
     } catch (error) {
          next(error)
     }
})

router.post('/accounts/signup', async (req, res, next) => {
     const { email, password, firstname, lastname } = req.body
     try {
          const account = await AccountModel.query().findOne({
               email: email,
               isActive: 1,
          })

          if (account) throw new Error('email is already registered')

          const pass = bcrypt.hashSync(password, 10)
          const registered = await AccountModel.query().insertAndFetch({
               email: email,
               password: pass,
               firstname: firstname,
               lastname: lastname,
          })

          const d = Date.now()
          const adminEmail = 'caliljaudiannn@gmail.com'

          let admin = {
               from: 'mario1313aa@gmail.com',
               to: '',
               subject: 'Account Verification',
               text: 'Hello world horse', // plaintext body
               html: '',
          }

          let student = {
               from: 'lsbengineering@scanolongapo.com',
               to: '',
               subject: 'Account Verification',
               text: 'Hello world horse', // plaintext body
               html: '',
          }

          const urlToken = await jwt.sign({ id: registered.account_id })

          // mailOptions.html = `<a href="http://lsb.scanolongapo.com/student/question/form/${urlToken}/${studentToken}">click moko haha</a>`
          admin.to = adminEmail

          admin.html = ` <p>Fullname of Account Owner: ${firstname} ${lastname}</p>
                         <p>is Requesting for a Verification</p>
                         <p>This is the batch number ${d} of ${email} that he/she will present the same batch number that we sent on this email <br /> <a href="https://lsb.scanolongapo.com/account/verification/${urlToken}">Click here to Verify Account</a> </p>
 
                         `

          await sendMail(admin)

          //student side
          student.to = registered.email

          student.html = `
                    <h1>${firstname} ${lastname}</h1>
                    <br/>
                    <p>Please Present this batch number ${d} to ${adminEmail} </p>
                    <br />`

          await sendMail(student)

          res.status(200).json('ok')
     } catch (error) {
          next(error)
     }
})

router.patch('/verify/account', async (req, res, next) => {
     const { studentToken } = req.body
     try {
          console.log(studentToken)
          const auth = studentToken
          if (!auth) throw new Error('No Auth Provided')

          const decoded = await jwt.verify(auth)
          if (!decoded) throw new Error('Invalid Token')

          const isVerified = await AccountModel.query().findById(decoded.id)
          if (isVerified.isActive === 1) {
               throw new Error('Account is Already Verified')
          } else {
               const student = await AccountModel.query()
                    .findById(decoded.id)
                    .patch({
                         isActive: 1,
                    })

               res.status(200).json('grade updated!')
          }
     } catch (error) {
          next(error)
     }
})

router.patch('/subjectGrade/students', async (req, res, next) => {
     const { totalGrade, date_created, student_id, term } = req.body
     try {
          console.log(req.body)
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
          exam_purpose,
          question_form,
          subject_code,
          stdEmail,
          date_end,
          time_end,
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
                    exam_purpose,
                    date_end,
                    time_end,
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
                    exam_purpose,
                    date_end,
                    time_end,
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
                    exam_purpose,
                    date_end,
                    time_end,
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

               let mailOptions = {
                    from: 'lsbengineering@scanolongapo.com',
                    to: '',
                    subject: 'Question Form',
                    text: 'Hello world horse', // plaintext body
                    html: '',
               }
               const isOk = await Promise.all(
                    students.map(async (k) => {
                         let studentToken = await jwt.sign({
                              id: k.student_id,
                         })

                         // mailOptions.html = `<a href="http://lsb.scanolongapo.com/student/question/form/${urlToken}/${studentToken}">click moko haha</a>`

                         mailOptions.html = `<a href="https://lsb.scanolongapo.com/student/question/form/${urlToken}/${studentToken}">Take Exam</a>`
                         mailOptions.to = k.student_email

                         isFinished = await sendMail(mailOptions)

                         return {
                              batch_number: batch_number,
                              student_id: k.student_id,
                              subject_code: subject_code,
                         }
                    })
               )

               let isSent = await EmailStatus.query().insertGraph(isOk)

               if (isSent) res.status(200).json(questData)

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
          const subjectExist = await EnrolledStudents.query()
               .where('isDropped', 0)
               .findOne({
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

router.post('/add/old/students', async (req, res, next) => {
     const { subject_code, subject_sem, listStudents } = req.body

     try {
          const isEnrolled = await EnrolledStudents.query()
               .where('isDropped', 0)
               .andWhere('subject_code', subject_code)
               .whereIn('student_id', listStudents)

          const checkIfDrop = await EnrolledStudents.query()
               .where('isDropped', 1)
               .andWhere('subject_code', subject_code)
               .whereIn('student_id', listStudents)

          const studentsExist = isEnrolled.map((k) => k.student_id)

          const studentsInfo = await StudentModel.query().whereIn(
               'student_id',
               studentsExist
          )

          const isError = studentsInfo.map((k) => k.firstname)

          if (studentsInfo.length > 0) throw new Error(isError)

          let list = []

          listStudents.map((k) => {
               let notEnrolled = isEnrolled.every((o) => o.student_id !== k)
               let notDropped = checkIfDrop.every((y) => y.student_id !== k)

               if (notEnrolled && notDropped && !list.includes(k)) {
                    console.log(k)
                    list.push(k)
               }
          })

          const students = await StudentModel.query().whereIn(
               'student_id',
               list
          )

          const payload = students.map((k) => {
               return {
                    current_sem: subject_sem,
                    school_year: '2021',
                    student_id: k.student_id,
                    subject_code: subject_code,
               }
          })

          if (checkIfDrop.length > 0 && payload.length > 0) {
               const ids = checkIfDrop.map((k) => k.student_id)

               await EnrolledStudents.query()
                    .whereIn('student_id', ids)
                    .update({
                         isDropped: 0,
                    })

               const enrollStudent = await EnrolledStudents.query().insertGraph(
                    payload
               )
          } else if (checkIfDrop.length > 0) {
               const ids = checkIfDrop.map((k) => k.student_id)

               await EnrolledStudents.query()
                    .whereIn('student_id', ids)
                    .update({
                         isDropped: 0,
                    })
          } else {
               const enrollStudent = await EnrolledStudents.query().insertGraph(
                    payload
               )
          }

          res.status(200).json('hahhaah')
     } catch (err) {
          next(err)
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

               let mailOptions = {
                    from: 'lsbengineering@scanolongapo.com',
                    to: '',
                    subject: 'Question Form',
                    text: 'Hello world horse', // plaintext body
                    html: '',
               }

               const isOk = await Promise.all(
                    students.map(async (k) => {
                         let studentToken = await jwt.sign({
                              id: k.student_id,
                         })

                         // mailOptions.html = `<a href="http://lsb.scanolongapo.com/student/question/form/${urlToken}/${studentToken}">Take Exam</a>`

                         mailOptions.html = `<a href="https://lsb.scanolongapo.com/student/question/form/${urlToken}/${studentToken}">Take Exam</a>`

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
