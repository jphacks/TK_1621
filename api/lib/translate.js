// Imports the Google Cloud client library
const Translate = require('@google-cloud/translate');

// Your Translate API key
const apiKey = 'AIzaSyBBrKHAumfSaP5EBfOsA5A27qRIWaj83c4';

// Instantiates a client
const translateClient = Translate({
  key: apiKey
});

// Translates some text into Russian
module.exports = (text, target, cb) => {
  translateClient.translate(text, target, (err, translation) => {
    if (err) {
      console.error(err);
      return;
    }
    cb(translation);
  });
};
