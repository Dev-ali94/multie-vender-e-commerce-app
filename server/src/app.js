import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('The server is live now!');
});

export default app

