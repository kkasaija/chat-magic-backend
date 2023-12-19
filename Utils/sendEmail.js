const nodemailer = require("nodemailer");

//CREATE TRANSPORTER
async function sendEmail(options) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "devqad9@gmail.com",
      pass: "yutz ixas unqe gxqa",
    },
  });

  //DEFINE EMAIL OPTIONS
  const emailOptions = {
    from: `Chat Magic Team< ${process.env.EMAIL_USERNAME} >`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  //SEND EMAIL
  return await transporter.sendMail(emailOptions);
}

module.exports = sendEmail;
