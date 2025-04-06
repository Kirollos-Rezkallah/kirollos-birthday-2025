// Function to fetch and update donation progress
async function updateDonationProgress() {
  try {
    // Fetch the donation page (using CORS proxy to avoid restrictions)
    const response = await fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(
        "https://www.tbank.ru/cf/4hYr0i1zcvR"
      )}`
    );

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    const htmlContent = data.contents;

    // Create a DOM parser to extract the donation amount
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // Find the donation amount element
    const moneyElement = doc.querySelector(".Money-module__money_UZBbh");

    if (!moneyElement)
      throw new Error("Could not find donation amount element");

    // Extract and clean the number (remove spaces, currency symbols, etc.)
    const amountText = moneyElement.textContent.trim();
    const amount = parseFloat(
      amountText.replace(/[^\d.,]/g, "").replace(",", ".")
    );

    if (isNaN(amount)) throw new Error("Could not parse donation amount");

    // Calculate percentage (15000 is the target amount)
    const percentage = Math.min(Math.round((amount / 15000) * 100), 100);

    // Update the progress bar and text
    document.querySelector(".progress-bar").style.width = `${percentage}%`;
    document.querySelector(
      ".progress-text"
    ).textContent = `${percentage}% funded (${amount.toLocaleString()} ₽)`;

    console.log(`Updated progress: ${percentage}% (${amount} ₽)`);
  } catch (error) {
    console.error("Error updating donation progress:", error);
    // Fallback to show something is wrong
    document.querySelector(".progress-text").textContent =
      "Progress update failed";
  }
}

// Initial update
updateDonationProgress();

// Update every 5 minutes (300000 ms)
setInterval(updateDonationProgress, 300000);
