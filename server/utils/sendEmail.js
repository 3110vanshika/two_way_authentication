const nodeMailer = require('nodemailer');

const sendEmail = async (email, OTP, text) => {
    try {
        const transporter = nodeMailer.createTransport({
            service: process.env.SERVICE,
            host: process.env.HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: 'Your OTP for verification',
            html: text
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log('Error sending email:', error);
    }
}

module.exports = sendEmail;