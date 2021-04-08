const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')

const mailgunAuth = {
      auth: {
            api_key: process.env.MAILGUN_APIKEY,
            domain: process.env.MAILGUN_DOMAIN,
      },
}

const smtpTransport = nodemailer.createTransport(mg(mailgunAuth))
const mailOptions = {
      from: process.env.TRANSPORT_EMAIL,
      to: '',
      subject: 'QUESTION FORM',
      html: `<h1>tamga</h1>`,
}

smtpTransport.sendMail(mailOptions, function (error, response) {
      if (error) {
            console.log(error)
      } else {
            console.log('Successfully sent email.')
      }
})
