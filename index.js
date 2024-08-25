require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const {
  generateShortUrl,
  redirectUserToOriginalUrl,
} = require('./controllers/shortUrl');
const app = express();

const domain = process.env.DOMAIN || 'localhost:3000';

// Basic Configuration
const port = process.env.PORT || 3000;

// middle ware to parse JSON and url encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

// connect to the database
connectDB();

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

//route to handle short url generation and database integration
app.post('/api/shorturl', generateShortUrl);

// route to redirect to original url
app.get('/api/shorturl/:shortUrl', redirectUserToOriginalUrl);
