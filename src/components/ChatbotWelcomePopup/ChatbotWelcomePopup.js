import { useState, useEffect } from "react";
import "./ChatbotWelcomePopup.css";

function ChatbotWelcomePopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if popup has been shown before
    const hasShownPopup = localStorage.getItem('portfolio-refresh-popup-shown');
    
    if (hasShownPopup) {
      return; // Don't show again if already shown
    }

    // Wait 5 seconds then check if chatbot is visible
    const timer = setTimeout(() => {
      const chatbotTrigger = document.querySelector('.chatbot-trigger');
      
      // If chatbot trigger is not found or not visible, show the popup
      if (!chatbotTrigger || chatbotTrigger.style.display === 'none' || 
          window.getComputedStyle(chatbotTrigger).display === 'none') {
        setShowPopup(true);
      }
    }, 5000); // 5 seconds delay

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    // Mark as shown so it doesn't appear again
    localStorage.setItem('portfolio-refresh-popup-shown', 'true');
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
          <h3>🤖 Chatbot Not Loading?</h3>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        
        <div className="popup-content">
          <div className="chatbot-icon">⚠️</div>
          
          <p className="welcome-message">
            It looks like the AI chatbot didn't load properly. This sometimes happens on the first visit.
          </p>
          
          <div className="issue-notice">
            <p className="notice-text">
              <strong>Quick Fix:</strong> A hard refresh will ensure all features load correctly, 
              including the interactive chatbot in the bottom-left corner.
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
              Continue Without Chatbot
            </button>
          </div>

          <p className="footer-text">
            This message will only appear once per session. 🚀
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatbotWelcomePopup;