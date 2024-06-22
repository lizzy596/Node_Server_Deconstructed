const https = require('https');
const http = require('http');
const url = require('url');

// Function to fetch a webpage and count the occurrences of a word
function fetchAndCountWord(webpageUrl, word, callback) {
  const parsedUrl = url.parse(webpageUrl);
  const protocol = parsedUrl.protocol === 'https:' ? https : http;

  protocol.get(webpageUrl, (response) => {
    let data = '';

    // Handle incoming data chunks
    response.on('data', (chunk) => {
      data += chunk;
    });

    // End of response
    response.on('end', () => {
      const wordCount = countWordOccurrences(data, word);
      callback(null, wordCount);
    });

  }).on('error', (error) => {
    callback(error, null);
  });
}

// Function to count occurrences of a word in a string
function countWordOccurrences(data, word) {
  const regex = new RegExp(`\\b${word}\\b`, 'gi'); // \b for word boundary, 'gi' for global and case-insensitive search
  const matches = data.match(regex);
  return matches ? matches.length : 0;
}

// Example usage
const webpageUrl = 'https://www.example.com';
const wordToCount = 'domain';

fetchAndCountWord(webpageUrl, wordToCount, (error, count) => {
  if (error) {
    console.error('Error fetching webpage:', error);
  } else {
    console.log(`The word "${wordToCount}" appears ${count} times on the page.`);
  }
});