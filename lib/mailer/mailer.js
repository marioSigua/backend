const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
     // service: 'gmail',

     service: 'gmail',
     auth: {
          user: process.env.TRANSPORT_EMAIL,
          pass: process.env.TRANSPORT_PASSWORD,
     },
})

let mailOptions = {
     from: 'teachers-help@lsb.scanolongapo.com',
     to: '',
     subject: 'QUESTION FORM',
     html: '',
}

let resp = false

async function wrapedSendMail(mailOptions) {
     return new Promise((resolve, reject) => {
          transporter.sendMail(mailOptions, function (error, info) {
               if (error) {
                    resolve(false) // or use rejcet(false) but then you will have to handle errors
               } else {
                    resolve(true)
               }
          })
     })
}

module.exports = {
     mailOptions: mailOptions,
     sendMail: wrapedSendMail,
}
