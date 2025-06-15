// routes/adminAuthRoutes.js
const express = require('express');
const router = express.Router();
const sendOtpSMS = require('../utils/sns');
const jwt = require('jsonwebtoken');

const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Billing_App';


const otpStore = new Map(); // In-memory (for demo; use Redis/DB in production)

router.post('/send-otp', async (req, res) => {
  const { contact } = req.body;
  if (!contact) return res.status(400).json({ msg: 'Contact is required' });

  const formattedNumber = contact.startsWith('+') ? contact : `+91${contact}`;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`Generated OTP for ${formattedNumber}: ${otp}`); // ✅ Fixed

  try {
    await sendOtpSMS(formattedNumber, otp);
    otpStore.set(contact, otp); // Temporary store

    res.json({ msg: 'OTP sent successfully' });
  } catch (err) {
    console.error('OTP send failed:', err);
    res.status(500).json({ msg: 'Failed to send OTP', error: err.message });
  }
});



// Optional: Verify OTP endpoint (if using server-side verification)
router.post('/verify-otp', (req, res) => {
  const { contact, otp } = req.body;
  const validOtp = otpStore.get(contact);

  if (otp === validOtp) {
    otpStore.delete(contact); // One-time use
    return res.json({ success: true });
  }

  res.status(400).json({ msg: 'Invalid OTP' });
});

// Register Admin after OTP verification
router.post('/register', async (req, res) => {
  const { fullName, contact, email, password } = req.body;

  if (!fullName || !contact || !email || !password) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  // (Optional but recommended) Check if this contact has already verified OTP
  // If you want stricter flow, you can store verified contacts in a Set or use DB

  const params = {
    TableName: TABLE_NAME,
    Item: {
      Contact: contact, // Primary Key
      FullName: fullName,
      Email: email,
      Password: password,
      CreatedAt: new Date().toISOString(),
    },
  };

  try {
    await dynamoDB.put(params).promise();
    res.status(201).json({ msg: 'Admin registered successfully' });
  } catch (err) {
    console.error('DynamoDB Save Error:', err);
    res.status(500).json({ msg: 'Failed to register admin', error: err.message });
  }
});

// routes/adminAuthRoutes.js (append this at the bottom)

router.post('/login', async (req, res) => {
  const { contact, password } = req.body;

  if (!contact || !password) {
    return res.status(400).json({ msg: 'Contact and Password are required' });
  }

  const params = {
    TableName: TABLE_NAME,
    Key: { Contact: contact },
  };

  try {
    const result = await dynamoDB.get(params).promise();

    if (!result.Item || result.Item.Password !== password) {
      return res.status(401).json({ msg: 'Invalid Contact or Password' });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { contact: result.Item.Contact, role: 'admin' }, // You can add more claims
      process.env.JWT_SECRET, // Make sure this is set in your `.env`
      { expiresIn: '7d' }
    );

    // ✅ Return token in response
    res.json({
      msg: 'Login successful',
      token,
    });
  } catch (err) {
    console.error('DynamoDB Login Error:', err);
    res.status(500).json({ msg: 'Login failed', error: err.message });
  }
});


module.exports = router;
