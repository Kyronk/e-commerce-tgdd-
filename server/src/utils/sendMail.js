const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");


const sendMail = asyncHandler(async ({email, html, subject}) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // async..await is not allowed in global scope, must use a wrapper
    // async function main() {
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"E-commerce TGDD" <no-relply@cuahangdientu.com>', // sender address
            to: email, // list of receivers
            // subject: "Forgot password", // plain text body
            subject: subject,
            html: html, // html body
        });

        // console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        //
        // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
        //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
        //       <https://github.com/forwardemail/preview-email>
        //
        
        return info;
    // }
    // main();
    // main().catch(console.error) // viết trong hàm main nó không chạy
})

module.exports = sendMail;



