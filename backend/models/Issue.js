import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
    {
        title: { 
            type: String,
            required: true 
        },
        description: { 
            type: String, 
            required: true 
        },
        location: { 
            type: String, 
            required: true 
        },
        coordinates: { 
            type: String 
        },
        image: { 
            type: String, 
            required: true 
        }, // Citizen-uploaded image
        completion_image: { 
            type: String 
        }, // Image uploaded by the department after completion
        department: {
            type: String,
            required: true,
            enum: ['MCC', 'CESC', 'PWD'],
        },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Resolved'],
            default: 'Pending',
        },
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
    },
    { timestamps: true } // This will automatically add createdAt and updatedAt fields
);

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;
