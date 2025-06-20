// utils/sns.js
const AWS = require('aws-sdk');
require('dotenv').config();

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const sns = new AWS.SNS();

const sendOtpSMS = async (phoneNumber, otp) => {
  const params = {
    Message: `Your OTP for admin registration is: ${otp}`,
    PhoneNumber: phoneNumber, // E.164 format (e.g., "+919876543210")
  };

  return sns.publish(params).promise();
};

module.exports = sendOtpSMS;
