const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Store emails in a file
const EMAILS_FILE = path.join(__dirname, 'emails.txt');

// Create the file if it doesn't exist
if (!fs.existsSync(EMAILS_FILE)) {
    fs.writeFileSync(EMAILS_FILE, '');
}

// Email subscription endpoint
app.post('/api/subscribe', (req, res) => {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    // Add email to file
    fs.appendFileSync(EMAILS_FILE, `${email}\n`, 'utf8');

    // Send confirmation email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com', // Replace with your email
            pass: 'your-app-password' // Replace with your app-specific password
        }
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Thank you for subscribing to MUSEÉ SANCH',
        text: 'Thank you for subscribing! We will notify you when we launch our collection.'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });

    res.json({ message: 'Subscription successful' });
});

// Read emails endpoint
app.get('/api/emails', (req, res) => {
    const emails = fs.readFileSync(EMAILS_FILE, 'utf8').split('\n').filter(email => email.trim());
    res.json({ emails });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
