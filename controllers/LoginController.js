const jwt = require('jsonwebtoken');
const zxcvbn = require('zxcvbn');
const nodemailer = require('nodemailer');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models/databaseModel');
const FRONTENDPORT = process.env.FRONTEND_PORT;
const IP = process.env.IP;

passport.use(
	new LocalStrategy({ usernameField: 'identifier' }, async (identifier, password, done) => {
		try {
			const user = await User.findOne({
				$or: [{ username: identifier }, { email: identifier }],
			});

			if (!user) {
				return done(null, false, { message: 'Username or email is wrong' });
			}

			const validPass = await user.verifyPassword(password);
			if (!validPass) {
				return done(null, false, { message: 'Invalid password' });
			}

			return done(null, user);
		} catch (err) {
			return done(err);
		}
	})
);

exports.signup = async (req, res, next) => {
	let user = new User(req.body);

	const passwordStrength = zxcvbn(user.password);
	if (passwordStrength.score < 3) {
		return res.status(400).json({ message: 'Password is too weak' });
	}

	try {
		const savedUser = await user.save();
		res.json(savedUser);
	} catch (err) {
		next(err);
	}
};

exports.login = (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) {
			return next(err);
		}

		if (!user) {
			return res.status(400).json(info);
		}

		const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
		res.header('auth-token', token).send(token);
	})(req, res, next);
};

exports.logout = (req, res) => {
	res.header('auth-token', '').send('Logged out');
};

exports.sendPasswordResetEmail = async (req, res) => {
	const { email } = req.body;

	// Look up the user in your database using the email
	const user = await User.findOne({ email });

	if (!user) {
		return res.status(400).json({ message: 'User with this email does not exist' });
	}

	// Generate a password reset token
	const token = Math.random().toString(36).substring(2);

	// Store the token in your database and associate it with the user
	user.resetPasswordToken = token;
	await user.save();

	// Create a Nodemailer transporter using SMTP
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		secure: false, // true for 465, false for other ports
		auth: {
			user: process.env.EMAIL,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	// Send an email to the user with the password reset link
	const mailOptions = {
		from: 'your-email@example.com',
		to: email,
		subject: 'Password Reset',
		text: `Click the following link to reset your password: ${IP}:${FRONTENDPORT}/reset-password/${token}`,
	};

	try {
		await transporter.sendMail(mailOptions);
		res.status(200).json({ message: 'Password reset link sent' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Failed to send password reset email' });
	}
};

exports.resetPassword = async (req, res) => {
	const { token } = req.params;
	const { password } = req.body;

	// Find the user with the reset token and make sure the token hasn't expired
	const user = await User.findOne({
		resetPasswordToken: token,
		resetPasswordExpires: { $gt: Date.now() },
	});

	if (!user) {
		return res.status(400).json({ message: 'Invalid or expired reset token' });
	}

	// Hash the new password and save it to the user
	user.password = await bcrypt.hash(password, 10);
	user.resetPasswordToken = undefined;
	user.resetPasswordExpires = undefined;
	await user.save();

	res.status(200).json({ message: 'Password successfully reset' });
};
/* 
TODO: SMTP server, email, and password.
*/
