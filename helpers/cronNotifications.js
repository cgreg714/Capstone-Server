const cron = require('node-cron');
const models = require('../models/databaseModel');
const createMedicationNotification = require('./createNotification');

// Calculate next intake time
function calculateNextIntakeTime(medication) {
	if (
		!medication.frequency.once &&
		!medication.frequency.daily &&
		!medication.frequency.weekly &&
		!medication.frequency.biWeekly &&
		!medication.frequency.monthly &&
		!Object.values(medication.frequency.dayOfTheWeek).some(Boolean)
	) {
		return null;
	}
	const nextIntakeTime = new Date();
	const time = new Date(medication.frequency.time);
	nextIntakeTime.setUTCHours(time.getUTCHours(), time.getUTCMinutes(), 0, 0);

	const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
	const currentDayOfWeek = daysOfWeek[nextIntakeTime.getUTCDay()];

	if (medication.frequency.once) {
		return nextIntakeTime;
	} else if (medication.frequency.daily) {
		if (new Date() > nextIntakeTime) {
			nextIntakeTime.setUTCDate(nextIntakeTime.getUTCDate() + 1);
		}
	} else if (medication.frequency.weekly) {
		if (new Date() > nextIntakeTime || !medication.frequency.dayOfTheWeek[currentDayOfWeek]) {
			nextIntakeTime.setUTCDate(nextIntakeTime.getUTCDate() + 7);
		}
	} else if (medication.frequency.monthly) {
		if (new Date() > nextIntakeTime) {
			nextIntakeTime.setUTCMonth(nextIntakeTime.getUTCMonth() + 1);
		}
	}

	return nextIntakeTime;
}

// Check for missed medications
async function checkForMissedMedications() {
	const profiles = await models.Profile.find().populate('medications');
	profiles.forEach(async (profile) => {
		profile.medications.forEach(async (medication) => {
			const nextIntakeTime = calculateNextIntakeTime(medication);
			if (nextIntakeTime && new Date() > nextIntakeTime) {
				const lastIntake = medication.medicationIntakes[medication.medicationIntakes.length - 1];
				if (!lastIntake || !isSameDay(lastIntake.takenAt, nextIntakeTime)) {
					const existingNotification = profile.notifications.find(
						(notification) =>
							notification.type === 'missed_medication' &&
							new Date(notification.createdAt).getTime() === nextIntakeTime.getTime()
					);
					if (!existingNotification) {
						const notificationData = {
							text: `You missed your ${
								medication.name
							} medication. It was supposed to be taken at ${nextIntakeTime.toLocaleTimeString('en-US', {
								hour: '2-digit',
								minute: '2-digit',
							})}.`,
							severity: 'high',
							type: 'missed_medication',
							createdAt: nextIntakeTime,
							read: false,
						};
						profile.notifications.push(notificationData);
					}
				}
			}
		});
		await profile.save();
	});
}

function isSameDay(date1, date2) {
	return (
		date1.getUTCFullYear() === date2.getUTCFullYear() &&
		date1.getUTCMonth() === date2.getUTCMonth() &&
		date1.getUTCDate() === date2.getUTCDate()
	);
}

// Create notifications for next intake
async function createNextIntakeNotifications() {
	const profiles = await models.Profile.find().populate('medications');
	profiles.forEach(async (profile) => {
		profile.medications.forEach(async (medication) => {
			const nextIntakeTime = calculateNextIntakeTime(medication);
			if (nextIntakeTime) {
				const reminderTime = new Date(nextIntakeTime.getTime() - 5 * 60 * 1000); // 5 minutes before next intake time

				if (Math.abs(new Date().getTime() - reminderTime.getTime()) < 60 * 1000) {
					const existingNotification = profile.notifications.find(
						(notification) =>
							notification.text ===
								`It's time to take ${
									medication.name
								} at ${nextIntakeTime.toLocaleTimeString()}.` &&
							notification.type === 'next_intake' &&
							new Date(notification.createdAt).getTime() === reminderTime.getTime()
					);
					if (!existingNotification) {
						const notificationData = {
							text: `It's time to take ${
								medication.name
							} at ${nextIntakeTime.toLocaleTimeString(
								'en-US',
								{ hour: '2-digit', minute: '2-digit' }
							)}.`,
							severity: 'medium',
							type: 'next_intake',
							createdAt: reminderTime,
							read: false,
						};
						profile.notifications.push(notificationData);
					}
				}
			}
		});
		await profile.save();
	});
}

// Check for low medications
async function checkForLowMedications() {
	const profiles = await models.Profile.find().populate('medications');
	profiles.forEach(async (profile) => {
		profile.medications.forEach(async (medication) => {
			const notificationData = createMedicationNotification(medication, medication.quantity);
			if (notificationData) {
				const existingNotification = profile.notifications.find(
					(notification) => notification.text === notificationData.text
				);
				if (!existingNotification) {
					notificationData.createdAt = new Date();
					notificationData.read = false;
					profile.notifications.push(notificationData);
				}
			}
		});
		await profile.save();
	});
}
// Run the functions every minute
cron.schedule('* * * * *', () => {
	checkForMissedMedications();
	createNextIntakeNotifications();
	checkForLowMedications();
});