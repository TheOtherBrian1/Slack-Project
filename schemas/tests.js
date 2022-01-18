import mongoose from 'mongoose';
const { Schema } = mongoose;

const tests = new Schema({
    allResults: [{date:Date, result: Number}],
    userId: String,
    testName: String,
    mostRecentScore: Number,
    leastRecentScore: Number
});

const Tests = mongoose.model('Tests', tests);