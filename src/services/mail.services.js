const dotenv = require("dotenv")
dotenv.config()
const nodemailer = require("nodemailer");
class mailServices {
  transporter;
  constructor() {
    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PWD,
        },
      })
    } catch (exception) {
      //throw new error ("error sand email connecting SMTP ...")
      throw { code: 500, msg: "error connecting SMTP server..." }
    }
  }
  sendEmail = async (to, sub, msg) => {
    try {
      let response = await this.transporter.sendMail({
        to: to,
        from: process.env.SMTP_FROM_ADDR,
        subject: sub,
        html: msg,
        text: msg
      })
      if (response) {
        return true
      } else {
        return false;
      }
    } catch (exception) {
      console.log(exception);
      throw { code: 500, msg: "error sending email" }
    }
  }
}
const mailSvc = new mailServices()
module.exports = mailSvc