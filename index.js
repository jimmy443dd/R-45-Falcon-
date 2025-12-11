const express = require('express');
const path = require('path');
const fs = require('fs');
const { validateAndExtractEmails } = require('./helpers');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Extract emails endpoint
app.post('/extract-emails', (req, res) => {
  const { url, pageContent } = req.body;

  if (!url || !pageContent) {
    return res.status(400).json({ error: 'URL and page content are required.' });
  }

  const emails = validateAndExtractEmails(pageContent);

  if (emails.length > 0) {
    const filePath = path.join(__dirname, 'emails.csv');
    const csvData = 'Email\n' + emails.join('\n');

    // Create CSV file automatically
    fs.writeFileSync(filePath, csvData);

    return res.json({
      message: `${emails.length} emails found.`,
      emails,
      downloadLink: '/emails.csv'
    });
  }

  return res.json({ message: 'No emails found.', emails: [] });
});

// CSV download endpoint
app.get('/emails.csv', (req, res) => {
  const filePath = path.join(__dirname, 'emails.csv');
  res.download(filePath, 'emails.csv');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
