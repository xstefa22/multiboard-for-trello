const mongoose = require('mongoose');

const OneTimeUserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    socketId: { type: String, required: false },
});

module.exports = mongoose.model('OneTimeUser', OneTimeUserSchema);
