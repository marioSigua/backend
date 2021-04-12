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
