// Add News
function addNews() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();

  // Validation
  if (!title || !description) {
    alert("Please fill in both title and description");
    return;
  }

  const button = event.target;
  button.disabled = true;
  button.textContent = "Adding...";

  fetch("/news", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, description })
  })
  .then(res => res.json())
  .then(data => {
    clearForm();
    loadNews();
    showNotification("✅ News added successfully!");
  })
  .catch(error => {
    console.error("Error:", error);
    showNotification("❌ Failed to add news. Please try again.");
  })
  .finally(() => {
    button.disabled = false;
    button.textContent = "✨ Add News";
  });
}

// Clear Form
function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("title").focus();
}

// Delete News
function deleteNews(id) {
  if (!confirm("Are you sure you want to delete this news?")) {
    return;
  }

  fetch(`/news/${id}`, {
    method: "DELETE"
  })
  .then(res => res.json())
  .then(data => {
    loadNews();
    showNotification("🗑️ News deleted successfully!");
  })
  .catch(error => {
    console.error("Error:", error);
    showNotification("❌ Failed to delete news. Please try again.");
  });
}

// Show Notification
function showNotification(message) {
  // Simple notification - you can enhance this later
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s ease-out;
    z-index: 1000;
    font-weight: 500;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Load News
function loadNews() {
  const newsList = document.getElementById("newsList");
  newsList.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading news...</p></div>';

  fetch("/news")
    .then(res => res.json())
    .then(data => {
      newsList.innerHTML = "";

      if (data.length === 0) {
        newsList.innerHTML = '<div class="empty-state"><p>📭 No news yet. Be the first to add one!</p></div>';
        return;
      }

      data.reverse().forEach(item => {
        const newsItem = document.createElement("div");
        newsItem.className = "news-item";
        newsItem.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="flex: 1;">
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.description)}</p>
            </div>
            <button class="delete-btn" onclick="deleteNews('${item._id}')">🗑️</button>
          </div>
        `;
        newsList.appendChild(newsItem);
      });
    })
    .catch(error => {
      console.error("Error loading news:", error);
      newsList.innerHTML = '<div class="empty-state"><p>❌ Failed to load news</p></div>';
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Load on page start
loadNews();

// Add keyboard shortcuts
document.getElementById("description").addEventListener("keydown", function(e) {
  if (e.key === "Enter" && e.ctrlKey) {
    addNews();
  }
});