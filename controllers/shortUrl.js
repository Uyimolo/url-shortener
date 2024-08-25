const crypto = require('crypto');
const Url = require('../models/url');
const isValidUrl = require('is-url');

// generate short url and save to database
const generateShortUrl = async (request, response) => {
  try {
    const originalUrl = request.body.url;

    // Check if URL is valid and domain is reachable
    if (!isValidUrl(originalUrl) || !/^https?:\/\//.test(originalUrl)) {
      return response.json({ error: 'invalid url' });
    }

    // Check if original URL already exists
    const alreadyExistingUrl = await Url.findOne({ originalUrl });
    if (alreadyExistingUrl) {
      return response.status(201).json({
        original_url: originalUrl,
        short_url: alreadyExistingUrl.shortUrl,
      });
    }

    // Generate a unique short URL
    const shortUrl = hashUrl(originalUrl);

    // Save the shortened URL to the database
    const newUrl = new Url({ originalUrl, shortUrl });
    await newUrl.save();

    // Return the shortened URL
    return response
      .status(201)
      .json({ original_url: originalUrl, short_url: shortUrl });
  } catch (error) {
    console.error(error);
    return response.status(400).json({ error: 'invalid url  ' });
  }
};

// redirect users to the original url
const redirectUserToOriginalUrl = async (request, response) => {
  try {
    const shortUrl = request.params.shortUrl;
    const url = await Url.findOne({ shortUrl });

    if (url) {
      response.redirect(301, url.originalUrl);
    } else {
      // If no URL is found, send a 404 error instead of redirecting
      response.status(404).json({ error: 'URL not found' });
    }
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
};

// generate unique short ids 
const hashUrl = (url) => {
  const shortUrl = crypto
    .createHash('sha256')
    .update(url)
    .digest('hex')
    .slice(0, 6);

  return shortUrl;
};

module.exports = { generateShortUrl, redirectUserToOriginalUrl };
