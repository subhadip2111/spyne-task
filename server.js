const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(cors());

app.use('/api', require('./routes/router'));
// // Define Routes
//app.use('/api/discussions', require('./routes/discussion'));
//app.use('/api/comments', require('./routes/comment'));

const PORT = process.env.PORT ;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
