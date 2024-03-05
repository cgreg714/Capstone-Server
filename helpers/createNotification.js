function createMedicationNotification(medication, quantity, existingNotifications = []) {
    let notificationText;
    let notificationSeverity;
    let notificationType;

    if (quantity === 0) {
        notificationText = `${medication.name} is empty. Please refill your prescription immediately.`;
        notificationSeverity = 'high';
        notificationType = 'empty_medication';
    } else if (quantity < 5 && !notificationExists(medication.name, 'high', 'low_medication', existingNotifications)) {
        notificationText = `${medication.name} is very low. Only ${quantity} remaining. Please refill your prescription now.`;
        notificationSeverity = 'high';
        notificationType = 'low_medication';
    } else if (quantity < 10 && !notificationExists(medication.name, 'medium', 'low_medication', existingNotifications)) {
        notificationText = `${medication.name} is low. Only ${quantity} remaining. Please refill your prescription soon.`;
        notificationSeverity = 'medium';
        notificationType = 'low_medication';
    } else if (quantity < 15 && !notificationExists(medication.name, 'low', 'low_medication', existingNotifications)) {
        notificationText = `${medication.name} is low. Only ${quantity} remaining. Consider refilling your prescription.`;
        notificationSeverity = 'low';
        notificationType = 'low_medication';
    }

    return notificationText ? { text: notificationText, severity: notificationSeverity, type: notificationType } : null;
}

function notificationExists(medicationName, severity, type, existingNotifications) {
    return existingNotifications.some(notification => 
        notification.text.includes(medicationName) && notification.severity === severity && notification.type === type);
}

module.exports = createMedicationNotification;