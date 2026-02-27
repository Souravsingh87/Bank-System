
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"bank_db" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, userName) {
  const subject = 'Welcome to bank_db!';
  const text = `Dear ${userName}, welcome to bank_db! We're excited to have you on board.`;
  const html = `<p>Dear <strong>${userName}</strong>, welcome to <strong>bank_db</strong>! We're excited to have you on board.</p>`;
  await sendEmail(userEmail, subject, text, html);
}
async function sendTransactionEmail(userEmail, username,amount,toAccount,){
  const subject = `Transaction Successful!`;
  const text=`hello ${username}, your transaction of amount ${amount} to account number ${toAccount} was successful.`;
  const html = `<p>Hello <strong>${username}</strong>, your transaction of amount <strong>${amount}</strong> to account number <strong>${toAccount}</strong> was successful.</p>`;
  await sendEmail(userEmail, subject, text, html);  
}

async function sendTransactionFailureEmail(userEmail, username,amount,toAccount,){
  const subject = `Transaction Failed!`;  
  const text=`hello ${username}, your transaction of amount ${amount} to account number ${toAccount} has failed. Please try again later.`;
  const html = `<p>Hello <strong>${username}</strong>, your transaction of amount <strong>${amount}</strong> to account number <strong>${toAccount}</strong> has failed. Please try again later.</p>`;
  await sendEmail(userEmail, subject, text, html);  
}




module.exports = { 
  sendEmail, sendRegistrationEmail, sendTransactionEmail, sendTransactionFailureEmail 
 }; // isko export krne ke liye humne module.exports ka use kiya hai, jisse hum is service ko dusre files me import kar sakte hain. aap.js mai require karyenge