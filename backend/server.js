import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoute from './routes/authRoute.js';
import issueRoutes from './routes/issueRoutes.js';

// Resolve __dirname in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Middleware to read JSON data from requests

// Routes
app.use('/api/auth', authRoute);
app.use('/api/issues', issueRoutes);

// Serve Uploaded Images as Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Route
app.get('/', (req, res) => {
    res.send('Issue Reporting System API is running...');
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
