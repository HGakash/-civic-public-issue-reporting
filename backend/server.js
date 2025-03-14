import path from 'path'
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoute from './routes/authRoute.js'
import issueRoutes from './routes/issueRoutes.js';

//resolving dot env path and loading the variables 
dotenv.config({ path: path.resolve("../.env") });

// Connect to MongoDB
connectDB();

const app = express();

const router = express.Router();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json())  //express.json() middleware to read JSON data from requests.

// Routes for authentication   
app.use('/api/auth', authRoute);

// Routes for issue
app.use('/api/issues', issueRoutes);


// Serve Uploaded Images as Static Files
router.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send('Issue Reporting System API is running...');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
