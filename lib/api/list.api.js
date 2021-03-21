const express = require('express')
const StudentModel = require('../../database/models/students.model')

const jwt = require('../token/jwt')
const EnrolledStudents = require('../../database/models/enrolled_students.model')
const {
      relationMappings,
} = require('../../database/models/enrolled_students.model')

const router = express.Router()

router.get('/list/students/:subject_code', async (req, res, next) => {
      const { subject_code } = req.params

      try {
            // uncomment niyo pag my flow na yung login
            // const auth = req.headers['authorization']
            // if (!auth) throw new Error('No auth provided')
            // const decoded = await jwt.verify(auth)
            // if (!decoded) throw new Error('No Token Provided')

            const listStudents = await EnrolledStudents.query()
                  .withGraphJoined('EnrolledStudents')
                  .where('subject_code', subject_code)

            res.status(200).json(listStudents)
      } catch (error) {
            next(error)
      }
})

module.exports = router
