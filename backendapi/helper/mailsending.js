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
      subject: "Karigar account verification",
      html: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <title>Account Verification OTP</title>
                </head>

                <body>
                  <p style="font-size: medium; margin-bottom: 10px">
                    Hi, <span style="color: #2672ec"><b>${data.emailaddress}</b></span>
                  </p>
                  <p style="font-size: medium">
                    Your verification request has been received from the
                    <span mailto:style="color:#2672ec;"><b>${data.emailaddress}</b></span>
                  </p>
                  <div style="font-size: medium; margin-bottom: 25px">
                    <p>
                      Here is your code:
                      <span style="color: #2672ec"><b>${data.otp}</b></span>
                    </p>
                  </div>
                  <p>Thanks,</p>
                  <p style="margin-top: 0px">The Karigar account team.</p>
                </body>
              </html>
              `,
    };
  } else {
    if (data.resetpassword == true) {
      var userVerification = {
        from: process.env.USEREMAIL,
        to: data.emailaddress,
        subject: "Karigar password reset",
        html: `
                <!DOCTYPE html>
                <html lang="en">

                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>title</title>
                </head>

                <body>
                    <p style="font-size: medium;margin-bottom: 10px;">Hi, <span style="color:#2672ec;"><b>${data.name}</b></span></p>
                    <h2 style="color:#2672ec;">Password Reset Code</h2>
                    <p style="font-size: medium;">Please use this code to reset the password for the Karigar Application 
                        <span mailto:style="color:#2672ec;"><b>${data.emailaddress}</b></span>
                    </p>
                    <div style="font-size: medium;margin-bottom: 25px;">
                        <p>Here is your code: <span style="color:#2672ec;"><b>${data.otp}</b></span></p>
                    </div>
                    <p>Thanks,</p>
                    <p style="margin-top: 0px;">The Karigar account team.</p>
                </body>

                </html>
                `,
      };
    }
  }

  return await transporter.sendMail(userVerification);
};

module.exports = { sendOtp };
