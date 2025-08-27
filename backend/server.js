const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/controllers/auth');
const mediaRoutes = require('./src/controllers/media');

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/media', mediaRoutes);

// Servir uploads
app.use('/uploads', express.static('uploads'));

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
