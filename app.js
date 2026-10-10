const guideGrid = document.getElementById("guideGrid");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const guideSelect = document.getElementById("guideSelect");
const bookingForm = document.getElementById("bookingForm");
const formMessage = document.getElementById("formMessage");
const dateInput = document.getElementById("dateInput");

dateInput.min = new Date().toISOString().slice(0, 10);

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));
}

function renderGuides(guides) {
  if (!guides.length) {
    guideGrid.innerHTML = '<p class="empty">No guides found. Try another city or keyword.</p>';
    return;
  }
  guideGrid.innerHTML = guides.map((guide) => `
    <article class="guide-card">
      <img src="${escapeHtml(guide.image)}" alt="Guide profile" loading="lazy"
           onerror="this.src='https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800'">
      <div class="guide-info">
        <div class="guide-top"><h3>${escapeHtml(guide.name)}</h3><span class="rating">★ ${guide.rating}</span></div>
        <p class="guide-city">⌖ ${escapeHtml(guide.city)} · ${escapeHtml(guide.language)}</p>
        <p class="guide-specialty">${escapeHtml(guide.specialty)}</p>
        <div class="guide-bottom">
          <div class="price"><strong>₹${Number(guide.price).toLocaleString("en-IN")}</strong> <small>/ guest</small></div>
          <button class="choose-btn" data-guide-id="${guide.id}">Choose guide</button>
        </div>
      </div>
    </article>`).join("");

  guideSelect.innerHTML = '<option value="">Select a guide</option>' + guides.map((g) =>
    `<option value="${g.id}">${escapeHtml(g.name)} — ${escapeHtml(g.city)}</option>`
  ).join("");
}

async function loadGuides(search = "") {
  guideGrid.innerHTML = '<p class="loading">Finding your guides…</p>';
  try {
    const response = await fetch(`/api/guides?search=${encodeURIComponent(search)}`);
    if (!response.ok) throw new Error("Could not load guides");
    const data = await response.json();
    renderGuides(data.guides);
  } catch (_error) {
    guideGrid.innerHTML = '<p class="empty">Could not connect to the server. Please start the Node.js app and refresh.</p>';
  }
}

searchButton.addEventListener("click", () => loadGuides(searchInput.value));
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") loadGuides(searchInput.value);
});
searchInput.addEventListener("input", () => {
  if (!searchInput.value.trim()) loadGuides("");
});

guideGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-guide-id]");
  if (!button) return;
  guideSelect.value = button.dataset.guideId;
  document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
});

bookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formMessage.className = "form-message";
  formMessage.textContent = "Submitting your request…";
  const formData = new FormData(bookingForm);
  const payload = Object.fromEntries(formData.entries());
  payload.guests = Number(payload.guests);

  try {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Booking failed");
    formMessage.className = "form-message success";
    formMessage.textContent = `${data.message} Reference: TG-${data.booking.id}. Status: ${data.booking.status}. Estimated total: ₹${data.booking.estimatedTotal.toLocaleString("en-IN")}.`;
    bookingForm.reset();
    dateInput.min = new Date().toISOString().slice(0, 10);
  } catch (error) {
    formMessage.className = "form-message error";
    formMessage.textContent = error.message || "Could not submit the booking.";
  }
});

loadGuides();