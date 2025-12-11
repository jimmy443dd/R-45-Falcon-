const express = require('express');
const path = require('path');
const fs = require('fs');
const { validateAndExtractEmails } = require('./helpers');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API endpoint
app.post('/extract-emails', (req, res) => {
  const { url, pageContent } = req.body;

  if (!url || !pageContent) {
    return res.status(400).json({ error: 'URL and page content are required.' });
  }

  const emails = validateAndExtractEmails(pageContent);

  if (emails.length > 0) {
    const filePath = path.join(__dirname, 'emails.csv');
    const csvData = 'Email\n' + emails.join('\n');
    fs.writeFileSync(filePath, csvData, 'utf8');

    return res.status(200).json({
      message: `${emails.length} emails found.`,
      emails,
      downloadLink: '/emails.csv'
    });
  }

  return res.status(200).json({ message: 'No emails found.', emails: [] });
});

// Download route
app.get('/emails.csv', (req, res) => {
  const filePath = path.join(__dirname, 'emails.csv');
  res.download(filePath, 'emails.csv');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
