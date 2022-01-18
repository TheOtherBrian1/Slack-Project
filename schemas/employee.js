import mongoose from 'mongoose';
const { Schema } = mongoose;

const employeeSchema = new Schema({
    firstName: String,
    lastName:   String,
    position: String,
    timeAtCompany: Number,
});

const Employee = mongoose.model('Employee', employeeSchema);