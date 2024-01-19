const mongoose = require('mongoose');

exports.getDatabases = async (req, res) => {
	try {
		const admin = mongoose.connection.getClient().db().admin();
		const databaseList = await admin.listDatabases();

		const filteredDatabases = databaseList.databases.filter(
			(db) => db.name !== 'admin' && db.name !== 'config' && db.name !== 'local'
		);

		res.status(200).json({ databases: filteredDatabases });
	} catch (error) {
		next(err);
	}
};

exports.deleteDatabase = async (req, res) => {
	const { databaseName } = req.params;

	try {
		if (!databaseName) {
			return res.status(400).json({ error: 'Invalid database name' });
		}

		const client = mongoose.connection.getClient();
		const db = client.db(databaseName);
		await db.dropDatabase();

		res.status(200).json({
			message: `Database ${databaseName} deleted successfully`,
		});
	} catch (error) {
		next(err);
	}
};
