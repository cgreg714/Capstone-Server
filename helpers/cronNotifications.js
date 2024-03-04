const cron = require('node-cron');
const models = require('../models/databaseModel');
const createMedicationNotification = require('./createNotification');

// Calculate next intake time
function calculateNextIntakeTime(medication) {
    const nextIntakeTime = new Date();
    const timeParts = medication.frequency.time.split(':');
    nextIntakeTime.setUTCHours(timeParts[0], timeParts[1], 0, 0);

    if (medication.frequency.once) {
        // If the medication is taken once, the next intake time is the current time
        return nextIntakeTime;
    } else if (medication.frequency.daily) {
        // If the medication is taken daily, the next intake time is the same time tomorrow
        if (new Date() > nextIntakeTime) {
            nextIntakeTime.setUTCDate(nextIntakeTime.getUTCDate() + 1);
        }
    } else if (medication.frequency.weekly) {
        // If the medication is taken weekly, the next intake time is the same time next week
        if (new Date() > nextIntakeTime) {
            nextIntakeTime.setUTCDate(nextIntakeTime.getUTCDate() + 7);
        }
    } else if (medication.frequency.biWeekly) {
        // If the medication is taken bi-weekly, the next intake time is the same time in two weeks
        if (new Date() > nextIntakeTime) {
            nextIntakeTime.setUTCDate(nextIntakeTime.getUTCDate() + 14);
        }
    } else if (medication.frequency.monthly) {
        // If the medication is taken monthly, the next intake time is the same time next month
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
            if (new Date() > nextIntakeTime) {
                const lastIntake = medication.medicationIntakes[medication.medicationIntakes.length - 1];
                if (!lastIntake || lastIntake.takenAt < nextIntakeTime) {
                    const existingNotification = profile.notifications.find(notification =>
                        notification.type === 'missed_medication' &&
                        new Date(notification.createdAt).getTime() === nextIntakeTime.getTime()
                    );
                    if (!existingNotification) {
                        const notificationData = {
                            text: `You missed your ${medication.name} medication. It was supposed to be taken at ${nextIntakeTime.toLocaleTimeString()}.`,
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

// Create notifications for next intake
async function createNextIntakeNotifications() {
    const profiles = await models.Profile.find().populate('medications');
    profiles.forEach(async (profile) => {
        profile.medications.forEach(async (medication) => {
            const nextIntakeTime = calculateNextIntakeTime(medication);
            const reminderTime = new Date(nextIntakeTime.getTime() - 5 * 60 * 1000); // 5 minutes before next intake time

            if (new Date().getTime() === reminderTime.getTime()) {
                const existingNotification = profile.notifications.find(notification =>
                    notification.text === `It's time to take your ${medication.name} medication in 5 minutes. It should be taken at ${nextIntakeTime.toLocaleTimeString()}.` &&
                    notification.type === 'next_intake' &&
                    new Date(notification.createdAt).getTime() === reminderTime.getTime()
                );
                if (!existingNotification) {
                    const notificationData = {
                        text: `It's time to take your ${medication.name} medication in 5 minutes. It should be taken at ${nextIntakeTime.toLocaleTimeString()}.`,
                        severity: 'medium',
                        type: 'next_intake',
                        createdAt: reminderTime,
                        read: false,
                    };
                    profile.notifications.push(notificationData);
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
                const existingNotification = profile.notifications.find(notification =>
                    notification.text === notificationData.text
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