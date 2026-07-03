// AURA OS Root Entrypoint
import './style.css';
import './audio.js';
import './canvas.js';
import './app.js';

// Setup Lucide icons globally on load
window.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});
