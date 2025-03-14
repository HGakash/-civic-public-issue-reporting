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
        image: { 
            type: String 
        }, // Image URL
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
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

const Issue = mongoose.model('Issue', issueSchema);
export default Issue;
