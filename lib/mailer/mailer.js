const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
     host: 'localhost',
     port: 465,
     secure: true,

     auth: {
          // user: '_mainaccount@scanolongapo.com',
          user: 't8uioa0w5uk4',
          pass: 'Password1',
     },
     logger: true,
     debug: true,
})

async function wrapedSendMail(mailOptions) {
     return new Promise((resolve, reject) => {
          transporter.sendMail(mailOptions, function (error, info) {
               if (error) {
                    console.log(error)
                    resolve(false) // or use rejcet(false) but then you will have to handle errors
                    transporter.close()
               } else {
                    console.log(info.response)

                    resolve(true)
                    transporter.close()
               }
          })
     })
}

module.exports = {
     sendMail: wrapedSendMail,
}
