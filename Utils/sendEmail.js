const nodemailer = require("nodemailer");

async function sendEmail(options) {
  //CREATE TRANSPORTER
  let transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //DEFINE EMAIL OPTIONS
  const emailOptions = {
    from: `KASAIJA KENNETH< ${process.env.EMAIL_USERNAME} >`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  //SEND EMAIL
  return transporter.sendMail(emailOptions);
}

module.exports = sendEmail;
