const express = require('express');
const fetch = require('node-fetch');
const { validateAndExtractEmails, exportToCSV } = require('./helpers');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle JSON requests
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to fetch webpage content and extract emails
app.post('/extract-emails', async (req, res) => {
  const { url } = req.body;

  if (!url || !url.startsWith('http')) {
    return res.status(400).json({ error: 'Invalid URL. Please provide a valid URL that starts with http or https.' });
  }

  try {
    // Fetch the webpage content
    const response = await fetch(url);
    const pageContent = await response.text();

    // Extract emails using helper function
    const emails = validateAndExtractEmails(pageContent);

    if (emails.length > 0) {
      // Save emails to a CSV file
      const filePath = path.join(__dirname, 'emails.csv');
      exportToCSV(emails, filePath);

      return res.status(200).json({
        message: `${emails.length} emails found.`,
        emails,
        downloadLink: '/emails.csv',
      });
    } else {
      return res.status(200).json({ message: 'No emails found.', emails: [] });
    }
  } catch (error) {
    console.error('Error fetching or processing URL:', error);
    return res.status(500).json({ error: 'Failed to fetch or process the webpage.' });
  }
});

// Endpoint for CSV download
app.get('/emails.csv', (req, res) => {
  const filePath = path.join(__dirname, 'emails.csv');
  res.download(filePath, 'emails.csv');
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
