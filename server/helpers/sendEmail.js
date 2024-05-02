const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const { SENDGRID_API_KEY, SENDGRID_FROM_EMAIL } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async data => {
  try {
    if (!data.to || !data.subject || !data.html) {
      throw new Error("Відсутні обов'язкові дані для відправки листа");
    }

    const email = { ...data, from: SENDGRID_FROM_EMAIL };
    await sgMail.send(email);

    console.log('Електронний лист був успішно відправлений:');

    return true;
  } catch (error) {
    console.error('Помилка під час відправки листа:', error.message);
    return false;
  }
};

module.exports = sendEmail;
