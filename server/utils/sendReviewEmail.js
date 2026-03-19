const nodemailer = require("nodemailer");

const sendReviewEmail = async (userEmail, userName, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your SMTP
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const reviewLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/review?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "How was your recent purchase?",
      html: `
        <h2>Hi ${userName},</h2>
        <p>We hope you're loving your purchase 💛</p>
        <p>It would mean a lot if you could leave a review.</p>
        <a href="${reviewLink}" 
           style="background:#000;color:#fff;padding:10px 15px;text-decoration:none;border-radius:5px;">
           Leave a Review
        </a>
        <p>Thank you for shopping with us!</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Review email sent: " + info.response);
    return true;
  } catch (error) {
    console.error("Error sending review email:", error);
    return false;
  }
};

module.exports = sendReviewEmail;
