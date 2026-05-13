const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const dbURI = process.env.DB_URI || 'mongodb://localhost:27017/library';
mongoose.connect(dbURI)
  .then(() => console.log('✅ Подключено к MongoDB'))
  .catch(err => console.error('❌ Ошибка MongoDB:', err));


const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

const bookRoutes = require('./routes/bookRoutes');
app.use('/books', bookRoutes);

app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://127.0.0.1:${PORT}`);
});