const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
            user: process.env.TRANSPORT_EMAIL,
            pass: process.env.TRANSPORT_PASSWORD,
      },
})

module.exports = {
      mailOptions: {
            from: 'vincentgorospe221@gmail.com',
            to: '',
            subject: 'QUESTION FORM',
            html: '<h1>hahahahah tangaka</h1>',
      },

      sendMail: function mailSend(obj) {
            return transporter.sendMail(obj, function (error, response) {
                  if (error) {
                        console.log(error)
                  } else {
                        console.log('Successfully sent email.')
                  }
            })
      },
}

// router.get('/try/sending', async (req, res, next) => {
//       try {
//             const emails = [
//                   'caliljaudiannnn@gmail.com',
//                   'mario.sigua.12@gmail.com',
//                   'vincentgorospe221@gmail.com',
//                   'davidargarin2104@gmail.com',
//             ]

//             emails.forEach(function (to, i, array) {
//                   mailOptions.to = to

//                   sendMail(mailOptions)
//             })

//             res.status(200).json('good')
//       } catch (error) {
//             next(error)
//       }
// })
