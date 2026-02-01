const express = require('express');
const app = express();
const port = 5000;

const users = require('./data/users');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', (req, res) => {
  res.status(200).json(users);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});