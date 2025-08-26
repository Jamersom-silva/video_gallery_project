const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/controllers/auth');
const mediaRoutes = require('./src/controllers/media');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', authRoutes);
app.use('/media', mediaRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
