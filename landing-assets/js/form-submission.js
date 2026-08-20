// ─── GOOGLE SHEET CONFIGURATION ──────────────────────
// Paste your deployed Google Apps Script Web App URL below:
const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbw4MjIR_ItjsIwlc06tfZWviWSG8Rwu3tSmGIWDSAcISAoL6Nn98Qfz_V5J7OBEP_7a1Q/exec";

/**
 * Submit form data to Google Sheet using modern fetch with no-cors.
 * 
 * WHY: fetch() with mode: 'no-cors' performs a simple request, bypassing CORS preflight
 * blocks just like a standard HTML form, without needing heavy iframe-injection logic.
 */
window.submitToGoogleSheet = (data) => {
  return new Promise((resolve) => {
    if (!GOOGLE_SHEET_WEBAPP_URL) {
      console.warn("GOOGLE_SHEET_WEBAPP_URL is not set. Lead recorded locally only.");
      resolve();
      return;
    }

    // Format data as url-encoded parameters (standard form submission style)
    const formData = new URLSearchParams();
    for (const key in data) {
      formData.append(key, data[key] != null ? data[key] : "");
    }

    try {
      fetch(GOOGLE_SHEET_WEBAPP_URL, {
        method: "POST",
        mode: "no-cors",
        keepalive: true,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
      })
      .then(() => {
        setTimeout(resolve, 400);
      })
      .catch((error) => {
        setTimeout(resolve, 400);
      });
    } catch (err) {
      resolve();
    }
  });
};
