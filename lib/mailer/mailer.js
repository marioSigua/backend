const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
     // service: 'gmail',

     host: 'smtp.mailtrap.io',
     port: 2525,
     auth: {
          user: '4cfdc01fadb425',
          pass: '46684e592f7f2f',
     },
})

module.exports = {
     mailOptions: {
          from: 'teachers-help@lsb.scanolongapo.com',
          to: '',
          subject: 'QUESTION FORM',
          html: '',
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
