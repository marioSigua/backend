const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
     // name: 'smtpout.secureserver.net',
     host: 'sg2plvcpnl464335.prod.sin2.secureserver.net',
     port: 465,
     secure: true,

     auth: {
          user: 'lsb-engineering2021@scanolongapo.com',
          pass: 'Password1',
     },
})

async function wrapedSendMail(mailOptions) {
     return new Promise((resolve, reject) => {
          transporter.sendMail(mailOptions, function (error, info) {
               if (error) {
                    resolve(false) // or use rejcet(false) but then you will have to handle errors
                    console.log(error)
               } else {
                    resolve(true)
                    console.log(info.response)
               }
          })
     })
}

module.exports = {
     sendMail: wrapedSendMail,
}
