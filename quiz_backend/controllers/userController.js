const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const User = require("../models/userModel");

let userController = {};

// Generate random OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider or a service like Mailgun
    auth: {
        user: process.env.EMAIL, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password
    },
});

// Register User

userController.registerUser = async (req, res) => {
    const { firstName, middleName, lastName, DOB, emailID, mobileNumber, password } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({ emailID });
        if (user) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        let mobileUser = await User.findOne({ mobileNumber });
        if (mobileUser) {
            return res.status(400).json({ message: 'Mobile number already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate OTP
        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

        // Create new user but don't set isVerified to true yet
        user = new User({
            firstName,
            middleName,
            lastName,
            DOB,
            emailID,
            mobileNumber,
            password: hashedPassword,
            otp,
            otpExpires,
        });

        // Save user to the database
        await user.save();

        // Send OTP via email
        const mailOptions = {
            from: process.env.EMAIL,
            to: emailID,
            subject: 'OTP Verification',
            text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error sending OTP' });
            }
            res.status(200).json({ message: 'OTP sent to email. Verify to complete registration.' });
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

userController.verifyOTP = async (req, res) => {
    const { emailID, otp } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ emailID });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if OTP is valid
        if (user.otp !== otp || Date.now() > user.otpExpires) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Mark user as verified and remove OTP fields
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ token, message: 'Email verified and registration complete' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Login User

userController.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ token, message: 'Logged in successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

userController.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
}

module.exports = userController;