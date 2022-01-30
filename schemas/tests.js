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
    submissionDate: Date,
    allResults: [{date:Date, score: Number}],
    mostRecentScore: Number
});

const Tests = mongoose.model('Tests', tests);
module.exports = Tests;