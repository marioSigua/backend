const express = require('express')
const AccountModel = require('../../database/models/accounts.model')

const bcrypt = require('bcrypt')
const jwt = require('../token/jwt')
const EnrolledStudents = require('../../database/models/enrolled_students.model')
const QuestionModel = require('../../database/models/questions.model')
const SubjectModel = require('../../database/models/subjects.model')

const router = express.Router()

router.post('/accounts/login', async (req, res, next) => {
      const { email, password } = req.body
      try {
            //promise to
            const account = await AccountModel.query().findOne({ email: email })
            if (!account) throw new Error('email is not registered')
            //promise to
            const checkPass = await bcrypt.compareSync(
                  password,
                  account.password
            )
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

router.post('/create/form/questions', async (req, res, next) => {
      const { form_topic, question_form, subject_code } = req.body

      try {
            const questData = await QuestionModel.query().insert(req.body)

            res.status(200).json('ok')
      } catch (error) {
            next(error)
      }
})

router.post('/create/form/questions', async (req, res, next) => {
      const { form_topic, question_form, subject_code } = req.body

      try {
            const questData = await QuestionModel.query().insert(req.body)

            res.status(200).json('ok')
      } catch (error) {
            next(error)
      }
})

router.patch('/add/prof/subjects', async (req, res, next) => {
      const { subject_code } = req.body
      console.log(req.body)
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
            console.log(isSuccess)
            if (isSuccess) res.status(200).json(true)
      } catch (error) {
            next(error)
      }
})

module.exports = router
