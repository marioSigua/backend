const express = require('express')
const AccountModel = require('../../database/models/accounts.model')

const bcrypt = require('bcrypt')
const jwt = require('../token/jwt')
const EnrolledStudents = require('../../database/models/enrolled_students.model')
const QuestionModel = require('../../database/models/questions.model')

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

router.post('/create/form', async (req, res, next) => {
      const {
            form_title,
            question_form,
            student_answer,
            student_id,
            subject_code,
      } = req.body

      try {
            await QuestionModel.query().insert(req.body)

            res.status(200).json('ok')
      } catch (error) {
            next(error)
      }
})

module.exports = router
