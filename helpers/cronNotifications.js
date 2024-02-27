const cron = require('node-cron');
const models = require('../models/databaseModel');

// Calculate next intake time
function calculateNextIntakeTime(medication) {
    const nextIntakeTime = new Date();
    if (medication.frequency.once) {
        // If the medication is taken once, the next intake time is the current time
        return nextIntakeTime;
    } else if (medication.frequency.daily) {
        // If the medication is taken daily, the next intake time is the same time tomorrow
        nextIntakeTime.setDate(nextIntakeTime.getDate() + 1);
    } else if (medication.frequency.weekly) {
        // If the medication is taken weekly, the next intake time is the same time next week
        nextIntakeTime.setDate(nextIntakeTime.getDate() + 7);
    } else if (medication.frequency.biWeekly) {
        // If the medication is taken bi-weekly, the next intake time is the same time in two weeks
        nextIntakeTime.setDate(nextIntakeTime.getDate() + 14);
    } else if (medication.frequency.monthly) {
        // If the medication is taken monthly, the next intake time is the same time next month
        nextIntakeTime.setMonth(nextIntakeTime.getMonth() + 1);
    }
    nextIntakeTime.setHours(medication.frequency.time.split(':')[0]);
    nextIntakeTime.setMinutes(medication.frequency.time.split(':')[1]);
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
                    // Check if a missed medication notification for the same medication and intake time already exists
                    const existingNotification = profile.notifications.find(notification =>
                        notification.text === `You missed your ${medication.name} medication.` &&
                        notification.type === 'missed_medication' &&
                        new Date(notification.createdAt).getTime() === nextIntakeTime.getTime()
                    );
                    if (!existingNotification) {
                        // Create missed medication notification
                        const notificationData = {
                            text: `You missed your ${medication.name} medication.`,
                            severity: 'high',
                            type: 'missed_medication',
                            createdAt: nextIntakeTime,
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
            if (new Date().getTime() === nextIntakeTime.getTime()) {
                // Check if a next intake notification for the same medication and intake time already exists
                const existingNotification = profile.notifications.find(notification =>
                    notification.text === `It's time to take your ${medication.name} medication.` &&
                    notification.type === 'next_intake' &&
                    new Date(notification.createdAt).getTime() === nextIntakeTime.getTime()
                );
                if (!existingNotification) {
                    // Create next intake notification
                    const notificationData = {
                        text: `It's time to take your ${medication.name} medication.`,
                        severity: 'medium',
                        type: 'next_intake',
                        createdAt: nextIntakeTime,
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
});