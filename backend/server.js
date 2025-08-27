const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./src/controllers/auth');
const mediaRoutes = require('./src/controllers/media');

app.use(cors()); // 🔹 permite que o frontend acesse o backend
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/media', mediaRoutes);

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
