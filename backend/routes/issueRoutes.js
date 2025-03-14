import express from 'express';
import Issue from '../models/Issue.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Create Issue with Image Upload
router.post('/report', protect, upload.single('image'), async (req, res) => {
    try {
        const { title, description, location, department } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null; // Store image path

        const issue = await Issue.create({
            title,
            description,
            location,
            image,
            department,
            user: req.user._id,
        });

        res.status(201).json(issue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Get All Issues
//Issue.find().populate('user', 'name email');
//This is a powerful Mongoose method that automatically replaces 
// the user field (which is typically just a user ID) with the actual user document
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
        const issues = await Issue.find({ department });
       
        res.json(issues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Issue Status
router.put('/status/:id', protect, async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        issue.status = req.body.status || issue.status;
        await issue.save();

        res.json(issue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Issue
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
