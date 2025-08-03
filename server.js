require('dotenv').config();

const express = require('express');
const mongoosse = require('mongoose');
const cors = require('cors');
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

const whitelist = [process.env.FRONTEND_URL];

const corsOption = {
    origin: (origin, callback) => {
        if(whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },

    optionsSuccessStatus: 200
};

app.use(cors(corsOption));
app.use(express.json());

mongoosse.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connection established successfully.'))
    .catch(err => console.error('MongoDB connection error:', err))

const PORT = process.env.PORT || 5000;

app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});