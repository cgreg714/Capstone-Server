const jwt = require('jsonwebtoken');
const zxcvbn = require('zxcvbn');
const nodemailer = require('nodemailer');

const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');

const models = require('../models/databaseModel');
const { success, error, incomplete } = require('../helpers/response');

const FPORT = process.env.FPORT;
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
	let user = new models.User(req.body);

	const passwordStrength = zxcvbn(user.password);
	if (passwordStrength.score < 3) {
		return next(Object.assign(new Error('Password is too weak'), { status: 400 }));
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
			return next(Object.assign(err, { status: 500 }));
		}

		if (!user) {
			return next(Object.assign(new Error(info.message), { status: 400 }));
		}

		req.login(user, { session: false }, async (error) => {
			if (error) return next(Object.assign(error, { status: 500 }));

			const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

			return res.status(200).send({ message: 'Logged in successfully', token: token });
		});
	})(req, res, next);
};

exports.logout = (req, res) => {
	res.setHeader('Authorization', '');
	success(res, 'Logged out');
};

exports.sendPasswordResetEmail = async (req, res, next) => {
	const { email } = req.body;

	const user = await models.User.findOne({ email });

	if (!user) {
		return next(new Error('User with this email does not exist'));
	}

	const token = Math.random().toString(36).substring(2);

	user.resetPasswordToken = token;
	await user.save();

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
		text: `Click the following link to reset your password: ${IP}:${FPORT}/reset-password/${token}`,
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

	const user = await models.User.findOne({
		resetPasswordToken: token,
		resetPasswordExpires: { $gt: Date.now() },
	});

	if (!user) {
		return next(new Error('Invalid or expired reset token'));
	}

	user.password = await bcrypt.hash(password, 10);
	user.resetPasswordToken = undefined;
	user.resetPasswordExpires = undefined;
	await user.save();

	success(res, 'Password successfully reset');
};
