const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    decision: {type: String, required: [true, 'decision cannot be empty']},
    user_id : {type:Schema.Types.ObjectId, ref: 'User'},
    connection_id: {type:Schema.Types.ObjectId, ref: 'Connection'}
}, {timestamps: true});

module.exports = mongoose.model('Rsvp', rsvpSchema);