const shortBtn = document.getElementById('shortBtn');
const copyBtn = document.getElementById('copyBtn');
const copyBtnDiv = document.getElementById('copyBtnDiv');
const showMsg = document.getElementById('showMsg');
const api_url = '/';

shortBtn.disabled = false;

// ---- Only HTTPS Validator ----
function isValidHttpsURL(input) {
  try {
    const url = new URL(input);
    return url.protocol === "http:" && url.hostname && !url.hostname.includes(" ");
  } catch {
    return false;
  }
}
// -----------------------------------

shortBtn.addEventListener('click', function () {
  const urlInputValue = document.getElementById('urlInput').value;

  if (!urlInputValue) {
    showMsg.innerText = 'Please paste your long URL here 👇';
    return;
  }

  if (!isValidHttpsURL(urlInputValue)) {
    showMsg.innerText = 'Only valid HTTPS URLs allowed 👇';
    return;
  }

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: urlInputValue }),
  };

  postData(api_url, requestOptions).catch((error) => {
    console.error('Failed to fetch:', error);
    showMsg.innerText = 'Error occurred. Please try again.';
    shortBtn.innerText = 'SHORT URL';
    shortBtn.disabled = false;
  });
});

async function postData(url, options) {
  try {
    shortBtn.innerText = 'Loading...';
    showMsg.innerText = 'Please wait...';
    shortBtn.disabled = true;

    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    copyBtnDiv.classList.remove('hidden');

    const newGenUrl = data.url;
    localStorage.setItem('newUrl', newGenUrl);

    if (newGenUrl) {
      document.getElementById('newUrlInput').value = newGenUrl;
      showMsg.innerText = 'Generate Success 👍';
      shortBtn.innerText = 'SHORT URL';
    }
  } catch (error) {
    showMsg.innerText = 'Error generating URL. Please try again.';
    shortBtn.innerText = 'Try Again';
  } finally {
    shortBtn.disabled = false;
  }
}

copyBtn.addEventListener('click', async function () {
  try {
    await navigator.clipboard.writeText(
      document.getElementById('newUrlInput').value
    );
    copyBtn.innerText = 'COPIED!!';
    showMsg.innerText = 'COPIED 👍';
  } catch (error) {
    console.error('Copy failed:', error);
    showMsg.innerText = 'Failed to copy. Try manually.';
  }
});
