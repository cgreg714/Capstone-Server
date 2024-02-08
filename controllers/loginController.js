const jwt = require('jsonwebtoken');
const zxcvbn = require('zxcvbn');
const nodemailer = require('nodemailer');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const models = require('../models/databaseModel');
const { success, error, incomplete } = require('../helpers/response');
const FRONTENDPORT = process.env.FRONTEND_PORT;
const IP = process.env.IP;

passport.use(
	new LocalStrategy({ usernameField: 'identifier' }, async (identifier, password, done) => {
		try {
			const user = await models.User.findOne({
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
	console.log("🚀 ~ file: loginController.js:35 ~ exports.signup= ~ req:", req.body)
	let user = new models.User(req.body);

	const passwordStrength = zxcvbn(user.password);
	if (passwordStrength.score < 3) {
		return next(new Error('Password is too weak'));
	}

	try {
		const savedUser = await user.save();
		success(res, savedUser);
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
            return next(new Error(info.message));
        }

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token);
        res.json({ user: { username: user.username } });
    })(req, res, next);
};

exports.logout = (req, res) => {
	res.header('auth-token', '');
	success(res, 'Logged out');
};

exports.sendPasswordResetEmail = async (req, res, next) => {
	const { email } = req.body;

	// Look up the user in your database using the email
	const user = await models.User.findOne({ email });

	if (!user) {
		return next(new Error('User with this email does not exist'));
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
		success(res, 'Password reset link sent');
	} catch (error) {
		next(error);
	}
};

exports.resetPassword = async (req, res, next) => {
	const { token } = req.params;
	const { password } = req.body;

	// Find the user with the reset token and make sure the token hasn't expired
	const user = await models.User.findOne({
		resetPasswordToken: token,
		resetPasswordExpires: { $gt: Date.now() },
	});

	if (!user) {
		return next(new Error('Invalid or expired reset token'));
	}

	// Hash the new password and save it to the user
	user.password = await bcrypt.hash(password, 10);
	user.resetPasswordToken = undefined;
	user.resetPasswordExpires = undefined;
	await user.save();

	success(res, 'Password successfully reset');
};