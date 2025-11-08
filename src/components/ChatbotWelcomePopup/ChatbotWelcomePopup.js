import { useState, useEffect } from "react";
import "./ChatbotWelcomePopup.css";

function ChatbotWelcomePopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Only show in production mode
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    // Check if user has visited before
    const hasVisited = localStorage.getItem('portfolio-chatbot-welcome-shown');
    
    if (!hasVisited) {
      // Show popup after a short delay to ensure page is loaded
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    // Mark as shown so it doesn't appear again
    localStorage.setItem('portfolio-chatbot-welcome-shown', 'true');
  };

  const handleRefresh = () => {
    // Refresh the page
    window.location.reload();
    handleClose();
  };

  // Get OS-specific shortcuts
  const getShortcuts = () => {
    const userAgent = navigator.userAgent;
    const isMac = /Mac|iPhone|iPad|iPod/.test(userAgent);
    const isWindows = /Win/.test(userAgent);
    
    if (isMac) {
      return {
        refresh: "⌘ + R",
        hardRefresh: "⌘ + Shift + R",
        os: "Mac"
      };
    } else if (isWindows) {
      return {
        refresh: "Ctrl + R",
        hardRefresh: "Ctrl + Shift + R or Ctrl + F5",
        os: "Windows"
      };
    } else {
      return {
        refresh: "Ctrl + R",
        hardRefresh: "Ctrl + Shift + R",
        os: "Linux"
      };
    }
  };

  const shortcuts = getShortcuts();

  if (!showPopup) {
    return null;
  }

  return (
    <div className="chatbot-welcome-overlay">
      <div className="chatbot-welcome-popup">
        <div className="popup-header">
          <h3>👋 Welcome to My Portfolio!</h3>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        
        <div className="popup-content">
          <div className="chatbot-icon">🤖</div>
          
          <p className="welcome-message">
            Hi there! I'm excited you're here. I've built an AI chatbot to help you learn about my projects, skills, and experience.
          </p>
          
          <div className="issue-notice">
            <p className="notice-text">
              <strong>Quick Note:</strong> If you don't see the chat icon in the bottom-left corner, 
              please try a hard refresh to ensure all features load properly.
            </p>
          </div>

          <div className="shortcuts-section">
            <h4>🔄 Quick Shortcuts ({shortcuts.os}):</h4>
            <div className="shortcut-item">
              <span className="shortcut-key">{shortcuts.refresh}</span>
              <span className="shortcut-desc">Regular refresh</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-key">{shortcuts.hardRefresh}</span>
              <span className="shortcut-desc">Hard refresh (recommended)</span>
            </div>
          </div>

          <div className="popup-actions">
            <button className="refresh-btn" onClick={handleRefresh}>
              🔄 Refresh Now
            </button>
            <button className="continue-btn" onClick={handleClose}>
              Continue Exploring
            </button>
          </div>

          <p className="footer-text">
            This message will only appear once. Enjoy exploring my work! 🚀
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatbotWelcomePopup;