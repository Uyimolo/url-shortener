const mongoose = require('mongoose');

// create a schema
const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
});

// create a model from the schema
const Url = mongoose.model('Url', urlSchema);

module.exports = Url;
