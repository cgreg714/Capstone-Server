const jwt = require('jsonwebtoken');
const zxcvbn = require('zxcvbn');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

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

exports.checkToken = (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).send({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Failed to authenticate token' });
        }

        req.userId = decoded._id;
        res.status(200).send({ message: 'Token is valid' });
    });
};

exports.sendPasswordResetEmail = async (req, res, next) => {
    const { email } = req.body;

    const user = await models.User.findOne({ email });

    if (!user) {
        const err = new Error('User with this email does not exist');
        err.status = 400;
        return next(err);
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);

    user.resetPasswordToken = otp;
    user.resetPasswordExpires = expires;

    await user.save();

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Password Reset',
        text: `Your OTP for password reset is: ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        success(res, 'OTP sent');
    } catch (error) {
        next(error);
    }
};

exports.verifyOTP = async (req, res, next) => {
    const { otp } = req.body;

    const user = await models.User.findOne({ resetPasswordToken: otp });

    if (!user || user.resetPasswordExpires < Date.now()) {
        const err = new Error('Invalid or expired OTP');
        err.status = 400;
        return next(err);
    }

    success(res, 'OTP verified');
};

exports.resetPassword = async (req, res, next) => {
    const { otp } = req.body;
    const { password } = req.body;

    const passwordStrength = zxcvbn(password);
    if (passwordStrength.score < 3) {
        return next(Object.assign(new Error('Password is too weak'), { status: 400 }));
    }

    let user;
    try {
        user = await models.User.findOne({
            resetPasswordToken: otp,
            resetPasswordExpires: { $gt: Date.now() },
        });
    } catch (error) {
        console.error('Error finding user:', error);
        return next(new Error('Error finding user: ' + error.message));
    }

    if (!user) {
        return next(new Error('Invalid or expired OTP'));
    }

    try {
        user.password = await bcrypt.hash(password, 10);
    } catch (error) {
        console.error('Error hashing password:', error);
        return next(new Error('Error hashing password: ' + error.message));
    }

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    try {
        await user.save();
    } catch (error) {
        console.error('Error saving user:', error);
        return next(new Error('Error saving user: ' + error.message));
    }

    success(res, 'Password successfully reset');
};