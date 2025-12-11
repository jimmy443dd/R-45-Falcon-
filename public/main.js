document.getElementById('extractForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const url = document.getElementById('url').value;
  const messageEl = document.getElementById('message');
  const emailsEl = document.getElementById('emails');
  const downloadEl = document.getElementById('downloadLink');

  messageEl.textContent = "Loading...";
  emailsEl.innerHTML = "";
  downloadEl.style.display = "none";

  try {
    // Fetch page HTML
    const pageResponse = await fetch(url);
    const pageContent = await pageResponse.text();

    // Send to backend for email extraction
    const response = await fetch('/extract-emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, pageContent })
    });

    const data = await response.json();

    messageEl.textContent = data.message;

    if (data.emails.length > 0) {
      data.emails.forEach(email => {
        const li = document.createElement('li');
        li.textContent = email;
        emailsEl.appendChild(li);
      });

      downloadEl.href = data.downloadLink;
      downloadEl.style.display = "inline-block";
    }

  } catch (error) {
    messageEl.textContent = "Error fetching the page.";
  }
});
