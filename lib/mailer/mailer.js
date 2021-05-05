const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
     host: 'smtp.gmail.com',
     port: 465,
     secure: true,

     auth: {
          user: 'mario1313aa@gmail.com',
          pass: 'Veanlimin1!',
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
                    console.log(info.response)

                    resolve(true)
               }
          })
     })
}

module.exports = {
     mailOptions: mailOptions,
     sendMail: wrapedSendMail,
}
