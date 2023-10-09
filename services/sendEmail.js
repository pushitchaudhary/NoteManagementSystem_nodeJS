const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Pushit Chaudhary <pushitcoc@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.text
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;