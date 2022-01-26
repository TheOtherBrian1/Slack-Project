const mongoose = require('mongoose');
const { Schema } = mongoose;

const employeeSchema = new Schema({
    identifier: {type: String, required: true},
    firstName: String,
    lastName:   String,
    position: String,
    timeAtCompany: Number,
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;