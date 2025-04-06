const twilio = require('twilio');
const Sms = require('../models/SMS');

const sendSms = async (smsData) => {
    const { parentPhone, message } = smsData;

    const client = twilio('AC1d0a30d8c5a3c97066033355d620858a', '9014ccc6d8245dd241aba834b8143ad5');
    try {
        await client.messages.create({
            body: message,
            from: '+16074247072',
            to: parentPhone,
        });
        console.log(`SMS sent to ${parentPhone}`);

        // Mark SMS as sent in the Sms collection
        await Sms.updateOne(
            { parentPhone, status: 'Absent', flag: 0 },
            { $set: { flag: 1 } }
        );
    } catch (error) {
        console.error('Failed to send SMS:', error);
    }
};

module.exports = { sendSms };