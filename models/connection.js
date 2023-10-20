const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectSchema = new Schema({
    title: {type: String, required: [true, 'title is required']},
    topic: {type: String, required: [true, 'topic is required']},
    detail: {type: String, required: [true, 'detail is required'], 
              minLength: [10, 'the detail should have at least 10 character']},
    author : {type:Schema.Types.ObjectId, ref: 'User'},
    locate: {type: String, required: [true, 'location is required']},
    date: {type: String, required: [true, 'date is required']},
    startTime: {type: String, required: [true, 'start time is required']},
    endTime: {type: String, required: [true, 'end time is required']},
    image: {type: String, required: [true, 'image is required']}
}, {timestamps: true});

module.exports = mongoose.model('Connection', connectSchema);