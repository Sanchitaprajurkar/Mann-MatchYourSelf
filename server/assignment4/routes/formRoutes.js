const express = require('express');
const router = express.Router();
const AssignmentForm = require('../models/FormModel');

// 1. POST → Save form data (Create)
router.post('/submit', async (req, res) => {
    try {
        const newFormEntry = new AssignmentForm(req.body);
        const savedEntry = await newFormEntry.save();
        res.status(201).json({
            success: true,
            message: "Data saved successfully",
            data: savedEntry
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error saving data",
            error: error.message
        });
    }
});

// 2. GET → Retrieve all data (Read)
router.get('/all', async (req, res) => {
    try {
        const allEntries = await AssignmentForm.find();
        res.status(200).json({
            success: true,
            data: allEntries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving data",
            error: error.message
        });
    }
});

// 3. PUT → Update data (Update)
router.put('/update/:id', async (req, res) => {
    try {
        const updatedEntry = await AssignmentForm.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedEntry) {
            return res.status(404).json({ success: false, message: "Entry not found" });
        }
        res.status(200).json({
            success: true,
            message: "Data updated successfully",
            data: updatedEntry
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error updating data",
            error: error.message
        });
    }
});

// 4. DELETE → Delete data (Delete)
router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedEntry = await AssignmentForm.findByIdAndDelete(req.params.id);
        if (!deletedEntry) {
            return res.status(404).json({ success: false, message: "Entry not found" });
        }
        res.status(200).json({
            success: true,
            message: "Data deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting data",
            error: error.message
        });
    }
});

module.exports = router;
