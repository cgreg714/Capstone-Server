const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
	const token = req.header('Authorization');
	if (!token) return res.status(401).json({ message: 'Access Denied' });

	try {
		const verified = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = verified._id;
		req.role = verified.role;
		next();
	} catch (err) {
		if (err instanceof jwt.TokenExpiredError) {
			return res.status(401).json({ message: 'Token expired' });
		} else if (err instanceof jwt.JsonWebTokenError) {
			return res.status(401).json({ message: 'Invalid Token' });
		} else {
			next(err);
		}
	}
};

const requireRole = (role) => {
	return (req, res, next) => {
		if (req.role && req.role === role) {
			next();
		} else {
			next(new Error('Forbidden'));
		}
	};
};

module.exports = { authenticate, requireRole };
