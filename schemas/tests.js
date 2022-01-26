const mongoose = require('mongoose');
const { Schema } = mongoose;

const tests = new Schema({
    test: {type: String, required: true},
    sections: {type: [{title: String, scores: [Number]}]},
    id: String,
    isSubmitted: Boolean,
    userName: String,
    team_id: String,
    name: String,
    activeIndex: Number,
    submissionDate: Date
});

const Tests = mongoose.model('Tests', tests);
module.exports = Tests;
// const tests = new Schema({
//     allResults: [{date:Date, result: Number}],
//     userId: String,
//     testName: String,
//     mostRecentScore: Number,
//     leastRecentScore: Number
// });