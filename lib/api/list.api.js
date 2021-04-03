const express = require('express')
const StudentModel = require('../../database/models/students.model')

const jwt = require('../token/jwt')
const EnrolledStudents = require('../../database/models/enrolled_students.model')
const SubjectModel = require('../../database/models/subjects.model')
const QuestionModel = require('../../database/models/questions.model')
const { ref } = require('../../database/models/enrolled_students.model')

const router = express.Router()

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

router.get('/exam/question', async (req, res, next) => {
      try {
            const questions = await QuestionModel.query()

            res.status(200).json(questions)
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
