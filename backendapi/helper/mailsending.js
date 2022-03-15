var nodemailer = require("nodemailer");

const sendOtp = async (data) => {
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.USEREMAIL,
      pass: process.env.PASSWORD,
    },
  });

  if (data.verification == true) {
    var userVerification = {
      from: process.env.USEREMAIL,
      to: data.emailaddress,
      subject: "karigar Application",
      html:
        "<!DOCTYPE html>" +
        "<html><head><title>Account Verification OTP</title>" +
        "</head><body><div>" +
        `<h3>Hi ${data.emailaddress}</h3>` +
        `<h4>Your verification request has been received from the ${data.emailaddress}</h4>` +
        `<h4>Your OPT is : <h2> ${data.otp} </h2></h4>` +
        "<h4>Thank you.</h4>" +
        "</div></body></html>",
    };
  } else {
    if (data.resetpassword == true) {
      var userVerification = {
        from: process.env.USEREMAIL,
        to: data.emailaddress,
        subject: "karigar Application",
        html:
          "<!DOCTYPE html>" +
          "<html><head><title>Reset password OTP</title>" +
          "</head><body><div>" +
          `<h3>Hi ${data.name}</h3>` +
          `<h4>Your reset password request has been received from the ${data.emailaddress}</h4>` +
          `<h4>Your reset password OPT is : <h2> ${data.otp} </h2></h4>` +
          "<h4>Thank you.</h4>" +
          "</div></body></html>",
      };
    }
  }

  return await transporter.sendMail(userVerification);
};

module.exports = { sendOtp };
