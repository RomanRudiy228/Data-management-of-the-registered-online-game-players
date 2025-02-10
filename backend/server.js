const express = require('express');
const bodyParser = require('body-parser');
const { connectToDB } = require('./src/config/db.js');
const path = require('path');
const playersRoutes = require('./src/routes/players.js');
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Players');

const PlayerSchema = new mongoose.Schema({
  nickname: String,
  level: Number,
  country: String,
  status: String,
  registrationDate: Date
});

const Player = mongoose.model('Player', PlayerSchema);

const app = express();
const PORT = 3000;

app.use(cors());

connectToDB();

app.use(bodyParser.json());

app.use('/api', playersRoutes);

app.get('/api/Players', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/Players', async (req, res) => {
  console.log(req.body);
  const { nickname, level, country, status } = req.body;

  try {
      const existingPlayer = await Player.findOne({ nickname });
      if (existingPlayer) {
          return res.status(400).json({ message: 'Player with this nickname already exists.' });
      }

      const newPlayer = new Player({ nickname, level, country, status });
      await newPlayer.save();
      res.status(201).json(newPlayer);
  } catch (error) {
      console.error('Error adding player:', error);
      res.status(500).json({ message: 'Failed to add player.' });
  }
});

app.delete('/api/Players/:id', async (req, res) => {
  try {
    const playerId = req.params.id;
    await Player.findByIdAndDelete(playerId);
    res.status(200).send({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(500).send("Internal Server Error");
});

app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use('/src', express.static(path.join(__dirname, '../frontend/src')));

// Повертається`index.html` за замовчуванням для всіх невідомих маршрутів
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});