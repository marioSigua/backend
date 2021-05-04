const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
     // service: 'gmail',
     host: 'sg2plvcpnl464335.prod.sin2.secureserver.net',
     port: 465,
     secureConnection: 'false',

     auth: {
          user: 'teachers-help@lsb.scanolongapo.com',
          pass: 'Password1',
     },

     tls: {
          ciphers: 'SSLv3',
          rejectUnauthorized: false,
     },
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
