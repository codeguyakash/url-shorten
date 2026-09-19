const shortenForm = document.getElementById("shortenForm");
const shortBtn = document.getElementById("shortBtn");
const copyBtn = document.getElementById("copyBtn");
const copyBtnDiv = document.getElementById("copyBtnDiv");
const showMsg = document.getElementById("showMsg");
const api_url = "/";


// ---- Only HTTPS Validator ----
function isValidHttpsURL(input) {
  try {
    const url = new URL(input);
    return (
      url.protocol === "https:" && url.hostname && !url.hostname.includes(" ")
    );
  } catch {
    return false;
  }
}
// -----------------------------------

shortenForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const urlInputValue = document.getElementById("urlInput").value;

  if (!urlInputValue) {
    showMsg.innerText = "Add a URL to get started.";
    return;
  }

  if (!isValidHttpsURL(urlInputValue)) {
    showMsg.innerText = "Please use a valid HTTPS URL.";
    return;
  }

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: urlInputValue }),
  };

  postData(api_url, requestOptions).catch((error) => {
    console.error("Failed to fetch:", error);
    showMsg.innerText = "Error occurred. Please try again.";
    shortBtn.innerText = "SHORT URL";
    shortBtn.disabled = false;
  });
});

async function postData(url, options) {
  try {
    shortBtn.innerText = "Loading...";
    showMsg.innerText = "Please wait...";
    shortBtn.disabled = true;

    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    copyBtnDiv.classList.remove("is-hidden");

    const newGenUrl = data.url;
    localStorage.setItem("newUrl", newGenUrl);

    if (newGenUrl) {
      document.getElementById("newUrlInput").value = newGenUrl;
      showMsg.innerText = "Your short link is ready.";
      shortBtn.innerHTML = 'Shorten another <span aria-hidden="true">→</span>';
    }
  } catch (error) {
    showMsg.innerText = "Something went wrong. Please try again.";
    shortBtn.innerHTML = 'Try again <span aria-hidden="true">→</span>';
  } finally {
    shortBtn.disabled = false;
  }
}

copyBtn.addEventListener("click", async function () {
  try {
    await navigator.clipboard.writeText(
      document.getElementById("newUrlInput").value,
    );
    copyBtn.innerText = "Copied";
    showMsg.innerText = "Copied to your clipboard.";
  } catch (error) {
    console.error("Copy failed:", error);
    showMsg.innerText = "Copy failed. You can select the link manually.";
  }
});
const year = new Date().getFullYear();

console.log(`COPYRIGHT © ${year} | Developed by CODEGUYAKASH | All rights reserved.`);