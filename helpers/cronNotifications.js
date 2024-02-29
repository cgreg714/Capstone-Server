const cron = require('node-cron');
const models = require('../models/databaseModel');

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
            let severity;
            let message;
            let type;

            if (medication.quantity === 0) {
                severity = 'error';
                message = `You are out of ${medication.name}. Please refill your prescription immediately.`;
                type = 'empty_medication';
            } else if (medication.quantity <= 5) {
                severity = 'high';
                message = `You are critically low on ${medication.name}. Only ${medication.quantity} remaining. Please refill your prescription.`;
                type = 'low_medication';
            } else if (medication.quantity <= 10) {
                severity = 'medium';
                message = `You are low on ${medication.name}. Only ${medication.quantity} remaining. Please refill your prescription soon.`;
                type = 'low_medication';
            } else if (medication.quantity <= 15) {
                severity = 'low';
                message = `You have ${medication.quantity} of ${medication.name} remaining. Consider refilling your prescription.`;
                type = 'low_medication';
            }

            if (message) {
                const existingNotification = profile.notifications.find(notification =>
                    notification.text === message
                );
                if (!existingNotification) {
                    const notificationData = {
                        text: message,
                        severity: severity,
                        type: type,
                        createdAt: new Date(),
                        read: false,
                    };
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