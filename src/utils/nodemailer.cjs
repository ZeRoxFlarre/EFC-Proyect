const nodemailer = require('nodemailer');
require('dotenv').config(); // Import the dotenv library to read environment variables

const sendEmail = async (email, subject, message) => {
    // ...
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject,
        text: message,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Re-throw the error to handle it at the caller's level
    }

};

module.exports = sendEmail;
