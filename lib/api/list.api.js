const express = require('express')
const StudentModel = require('../../database/models/students.model')

const jwt = require('../token/jwt')
const EnrolledStudents = require('../../database/models/enrolled_students.model')
const SubjectModel = require('../../database/models/subjects.model')

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
                  .where('EnrolledSubjects.subject_code', subject_code)

            for (const sub of listStudents) {
                  delete sub.EnrolledSubjects
            }
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

            const subjects = await SubjectModel.query()

            res.status(200).json(subjects)
      } catch (error) {
            next(error)
      }
})

module.exports = router
