const express = require('express')
const StudentModel = require('../../database/models/students.model')

const jwt = require('../token/jwt')
const EnrolledStudents = require('../../database/models/enrolled_students.model')
const SubjectModel = require('../../database/models/subjects.model')
const QuestionModel = require('../../database/models/questions.model')
const router = express.Router()
const ResponseModel = require('../../database/models/student_response.model')

router.get('/list/students/:subject_code', async (req, res, next) => {
     const { subject_code } = req.params

     try {
          // uncomment niyo pag my flow na yung login
          // const auth = req.headers['authorization']
          // if (!auth) throw new Error('No auth provided')
          // const decoded = await jwt.verify(auth)
          // if (!decoded) throw new Error('No Token Provided')
          const listStudents = await StudentModel.query()
               .withGraphJoined('EnrolledSubjects')
               .select(
                    'firstname',
                    'lastname',
                    'students_tbl.student_id',
                    'EnrolledSubjects.created_at'
               )
               .where('EnrolledSubjects.subject_code', subject_code)

          res.status(200).json(listStudents)
     } catch (error) {
          next(error)
     }
})

router.get('/list/subjects', async (req, res, next) => {
     try {
          // uncomment niyo pag my flow na yung login
          // const auth = req.headers['authorization']
          // if (!auth) throw new Error('No auth provided')
          // const decoded = await jwt.verify(auth)
          // if (!decoded) throw new Error('No Token Provided')

          const subjects = await SubjectModel.query().where('isOccupied', 0)

          res.status(200).json(subjects)
     } catch (error) {
          next(error)
     }
})

router.get('/subjectGrade/listGrade', async (req, res, next) => {
     const { student_id, created_at, subject_code, term } = req.query

     try {
          // uncomment niyo pag my flow na yung login
          // const auth = req.headers['authorization']
          // if (!auth) throw new Error('No auth provided')
          // const decoded = await jwt.verify(auth)
          // if (!decoded) throw new Error('No Token Provided')

          const subjects = await EnrolledStudents.query().modify((list) => {
               if (term === 'Prelims') {
                    list.select('prelim_grade')
                         .where('student_id', student_id)
                         .andWhere('created_at', created_at)
                         .andWhere('subject_code', subject_code)
               } else if (term === 'Midterm') {
                    list.select('midterm_grade')
                         .where('student_id', student_id)
                         .andWhere('created_at', created_at)
                         .andWhere('subject_code', subject_code)
               } else {
                    list.select('finals_grade')
                         .where('student_id', student_id)
                         .andWhere('created_at', created_at)
                         .andWhere('subject_code', subject_code)
               }
          })

          res.status(200).json(subjects[0])
     } catch (error) {
          next(error)
     }
})

router.get('/student/question/:token/:student_id', async (req, res, next) => {
     const { token, student_id } = req.params
     try {
          const decoded = await jwt.verify(token)
          if (student_id) {
               const decodedStudentId = await jwt.verify(student_id)

               const ifResponded = await ResponseModel.query()
                    .where('batch_number', decoded.id)
                    .andWhere('student_id', decodedStudentId.id)

               if (ifResponded.length > 0)
                    throw new Error('You already have submitted')
          }

          const questions = await QuestionModel.query().where(
               'batch_number',
               decoded.id
          )

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

                    question_text: k.question_text ? k.question_text : null,

                    question_image: k.question_image
                         ? JSON.parse(k.question_image)
                         : null,

                    choices: k.choices ? k.choices : null,
                    subject_code: k.subject_code,
               }
          })

          res.status(200).json(questData)
     } catch (error) {
          next(error)
     }
})

router.get('/student/response/:token', async (req, res, next) => {
     const { token } = req.params
     try {
          const decoded = await jwt.verify(token)

          const questions = await QuestionModel.query().where(
               'batch_number',
               decoded.id
          )

          const questData = questions.map((k) => {
               return {
                    batch_number: k.batch_number,
                    form_number: k.form_number,
                    type: k.type,
                    format: k.format,
                    topic: k.topic,
                    term: k.term,
                    form_answer: k.form_answer,
                    question_text: k.question_text ? k.question_text : null,

                    question_image: k.question_image
                         ? JSON.parse(k.question_image)
                         : null,

                    choices: k.choices ? k.choices : null,
                    subject_code: k.subject_code,
               }
          })

          res.status(200).json(questData)
     } catch (error) {
          next(error)
     }
})

router.get('/exam/question', async (req, res, next) => {
     try {
          const questions = await QuestionModel.query()

          const questData = questions.map((k) => {
               return {
                    batch_number: k.batch_number,
                    form_number: k.form_number,
                    type: k.type,
                    format: k.format,
                    topic: k.topic,
                    term: k.term,
                    form_answer: k.form_answer,
                    question_text: k.question_text ? k.question_text : null,

                    question_image: k.question_image
                         ? JSON.parse(k.question_image)
                         : null,

                    choices: k.choices ? JSON.parse(k.choices) : null,
                    subject_code: k.subject_code,
               }
          })

          res.status(200).json(questData)
     } catch (error) {
          next(error)
     }
})

router.get('/exam/history', async (req, res, next) => {
     try {
          const questions = await QuestionModel.query().groupBy('batch_number')
          const questData = await Promise.all(
               questions.map(async (k) => {
                    const token = await jwt.sign({ id: k.batch_number })
                    return {
                         url: token,
                         term: k.term,
                         batch_number: k.batch_number,
                         subject_code: k.subject_code,
                         created_at: k.created_at,
                    }
               })
          )

          const studentResponse = await ResponseModel.query()
               .select('*')
               .groupBy('batch_number')
               .groupBy('student_id')
               .sum({ score: 'student_score' })

          const responseData = await Promise.all(
               studentResponse.map(async (k) => {
                    const student_token = await jwt.sign({ id: k.student_id })
                    return {
                         student_id: k.student_id,
                         student_token: student_token,
                         score: k.score,
                         batch_number: k.batch_number,
                         subject_code: k.subject_code,
                    }
               })
          )

          const merge = {
               history: questData,
               studentResponse: responseData,
          }

          res.status(200).json(merge)
     } catch (error) {
          next(error)
     }
})

router.get('/assigned/subjects', async (req, res, next) => {
     try {
          const auth = req.headers['authorization']
          if (!auth) throw new Error('no auth')
          const decoded = await jwt.verify(auth)
          if (!decoded) throw new Error('Wrong token format')

          const subjects = await SubjectModel.query().where(
               'account_id',
               decoded.id
          )

          res.status(200).json(subjects)
     } catch (error) {
          next(error)
     }
})

router.get('/enrolled/students', async (req, res, next) => {
     try {
          const auth = req.headers['authorization']
          if (!auth) throw new Error('no auth')
          const decoded = await jwt.verify(auth)
          if (!decoded) throw new Error('Wrong token format')

          const students = await SubjectModel.query()
               .withGraphJoined('students')
               .where('account_id', decoded.id)
               .andWhere('current_year', new Date().getFullYear())
               .andWhere('isOccupied', 1)

          res.status(200).json(students)
     } catch (error) {
          next(error)
     }
})

module.exports = router
