document.getElementById('extractForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const url = document.getElementById('url').value;
  document.getElementById('message').textContent = 'Processing...';
  document.getElementById('emails').innerHTML = '';
  document.getElementById('downloadLink').style.display = 'none';

  try {
    const response = await fetch('/extract-emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, pageContent: 'Your webpage HTML content here' }), // Replace accordingly
    });

    const data = await response.json();

    document.getElementById('message').textContent = data.message;

    if (data.emails && data.emails.length > 0) {
      data.emails.forEach((email) => {
        const li = document.createElement('li');
        li.textContent = email;
        document.getElementById('emails').appendChild(li);
      });

      document.getElementById('downloadLink').style.display = 'block';
      document.getElementById('downloadLink').setAttribute('href', data.downloadLink);
    }
  } catch (error) {
    console.error('Error processing:', error);
    document.getElementById('message').textContent = 'An error occurred.';
  }
});
