const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
     host: 'smtp.gmail.com',
     port: 465,
     secure: true,

     auth: {
          user: 'caliljaudiannn@gmail.com',
          pass: 'jaudian29',
     },

     // tls: {
     //      ciphers: 'SSLv3',
     //      rejectUnauthorized: false,
     // },
})

let mailOptions = {
     from: 'lsb-engineering',
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
