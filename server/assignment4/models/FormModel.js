const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('AssignmentForm', FormSchema);
