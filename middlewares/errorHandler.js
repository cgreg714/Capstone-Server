module.exports = function errorHandler(err, req, res, next) {
    console.error(err.stack); // Log error stack trace to the console
    res.status(500).json({ error: err.message || 'Internal Server Error' });
}