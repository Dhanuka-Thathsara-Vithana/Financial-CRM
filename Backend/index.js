const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
  .then(() => console.log(`Connected to ${process.env.MONGO_DB} database...`))
  .catch(err => console.error('Could not connect to MongoDB:', err));

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', `${process.env.FRONTEND_URL}`); 
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({ 
    message: "Backend server is running", 
    status: "online",
    timestamp: new Date().toISOString()
  });
});

app.post('/', (req, res) => {
  res.status(200).json({ 
    message: "Backend server is running", 
    status: "online",
    timestamp: new Date().toISOString()
  });
});


// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Listening on port ${PORT}...`));
