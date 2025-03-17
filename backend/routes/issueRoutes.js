import express from 'express';
import Issue from '../models/Issue.js';
import {protect}  from "../middlewares/authMiddleware.js"
import upload from '../middlewares/uploadMiddleware.js'; // Ensure your multer config is properly set up

const router = express.Router();

// Report an issue (Citizen Uploads Image)
router.post('/report', protect, upload.single('image'), async (req, res) => {
    try {
        const { title, description, location, coordinates, department } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const image = `/uploads/${req.file.filename}`; // Save only filename or path

        const issue = await Issue.create({
            title,
            description,
            coordinates,
            location: Array.isArray(location) ? location.join(', ') : location,
            image, // Storing only citizen-uploaded image
            department,
            status: 'Pending', // Default status
            user: req.user._id, // Storing the user who reported
        });

        res.status(201).json(issue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get All Issues
router.get('/get-all', protect, async (req, res) => {
    try {
        const issues = await Issue.find().populate('user', 'name email');
        res.json(issues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Issues by Department
router.get('/department/:dept', protect, async (req, res) => {
    try {
        const department = req.params.dept.toUpperCase();
        const issues = await Issue.find({ department }).populate('user', 'name email');
        res.json(issues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Issue Status & Upload Completion Image (Handled by Department)
router.put('/update/:id', protect, upload.single('completion_image'), async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        // Update status if provided
        issue.status = req.body.status || issue.status;

        // If department uploads a completion image, store it
        if (req.file) {
            issue.completion_image = `/uploads/${req.file.filename}`; // Store the department's completion image path
        }

        await issue.save();

        res.json({ message: "Issue updated successfully", issue });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete an issue
router.delete('/:id', protect, async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        await issue.deleteOne();

        res.json({ message: 'Issue removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
