const User = require("../model/user"); // import User model
const bcrypt = require("bcrypt"); // import bcrypt for password hashing
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");
const OTPVerification = require("../model/otp_verification");

// function to handle user registration
const userSignup = async (req, res) => {
    try {
        const { name, email, password } = req?.body; // destsructure the user input request body

        // validation to check the required fields
        if(!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        if(!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        if(!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        // check if user already exists in database or not with email
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ message: "User already exists. Please login" });
        }
        const hashedPassword = await bcrypt.hash(password, 10); // hash the password with bcrypt

        // create a new user in the database
        const user = await User.create({ name, email, password: hashedPassword });
        return res.status(200).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(400).json({ message: error?.message });
    }
}

// function to handle user login
const userSignin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        // Find user by email
        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser) {
            return res.status(400).json({ message: "User does not exist. Please signup" });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate OTP and set 3-minute expiry
        const OTP = generateOTP();
        const expiresAt = Date.now() + 3 * 60 * 1000;

        // Store OTP and expiry in session
        req.session.email = email;
        req.session.OTP = { code: OTP, expiresAt };

        const text = `
            <p>Hello ${existingUser.name}</p>
            <p>Your OTP for login is: <strong>${OTP}</strong>
            <p>Don't share this OTP to anyone</p>
            <p>Thank You</p>
            `;

        // Send OTP via email
        await sendEmail(email, OTP, text);

        res.status(200).json({ message: "Login successful. OTP sent to your email and phone." });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// function to verify OTP
const verifyOTP = async (req, res) => {
    try {
        const { OTP } = req.body;

        // Check if OTP is provided
        if (!OTP) {
            return res.status(400).json({ message: "OTP is required" });
        }

        // Check if OTP is present in session
        if(!req.session.OTP) {
            return res.status(400).json({ message: "OTP not found. Please request a new OTP" });
        }

        // check if OTP is valid matched with OTP in session
        if(req.session.OTP.code !== OTP) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        // check if OTP is expired
        if(Date.now() > req.session.OTP.expiresAt) {
            return res.status(400).json({ message: "OTP expired" });
        }
        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Function for forgot password
const verifyEmail = async(req, res) => {
    try {
        const {email} = req?.body;

        // Check if email is provided
        if(!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if(!existingUser) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const OTP = generateOTP();
        const expiresAt = Date.now() + 3 * 60 * 1000;

        // Store OTP and expiry in session
        req.session.email = email;
        req.session.OTP = { code: OTP, expiresAt };

        const resetLink = `${process.env.CLIENT_URL}/resetPassword/${OTP}`;

        const text = `
            <p>Hello</p>
            <p>Click the below link to reset the password:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>Don't share this link to anyone</p>
            <p>Thank you</p>
            `;
        // Send OTP via email
        await sendEmail(email, OTP, text);
        res.status(200).json({ message: "Reset password link sent to your email" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// function to reset password
const resetPassword = async (req, res) => {
    try {
        const { OTP } = req.params;  // OTP received from the URL
        const { password, confirm_password } = req.body;  // Password and confirm password from the request body

        // Match password and confirm password
        if (password !== confirm_password) {
            return res.status(400).json({ message: "Password and confirm password do not match" });
        }

        // Check if OTP is present in session
        if (!req.session.OTP) {
            return res.status(400).json({ message: "OTP not found. Please request a new OTP" });
        }

        // Check if the OTP matches the one stored in session
        if (req.session.OTP.code !== OTP) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Check if OTP has expired
        if (Date.now() > req.session.OTP.expiresAt) {
            return res.status(400).json({ message: "OTP has expired. Please request a new OTP" });
        }

        // Find the user associated with the email stored in session
        const user = await User.findOne({ where: { email: req.session.email } });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Update the user's password
        user.password = await bcrypt.hash(password, 10);  // Hash the new password before saving it
        await user.save();

        // Clear OTP from the session as it has been used
        delete req.session.OTP;
        delete req.session.email;

        // Respond with success message
        res.status(200).json({ message: "Password reset successfully" });

    } catch (error) {
        console.error("Error during password reset:", error);
        res.status(500).json({ message: "An error occurred while processing your request" });
    }
};


module.exports = { userSignup, userSignin, verifyOTP, verifyEmail, resetPassword };