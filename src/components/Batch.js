import React, { useState, useEffect } from "react";

export const Batch = ({ onVisibilityChange }) => {
  // PWA install prompt states
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Notify parent about visibility changes
  useEffect(() => {
    if (onVisibilityChange) {
      onVisibilityChange(showInstallButton);
    }
  }, [showInstallButton, onVisibilityChange]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log("User choice:", outcome);

    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  return (
    <>
      {showInstallButton && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            background: "linear-gradient(135deg, #c770f0 0%, #be50f4 100%)", // Match portfolio gradient
            color: "white",
            padding: "12px 20px",
            zIndex: 10001,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(199, 112, 240, 0.3)",
            fontSize: "14px",
            fontWeight: "500",
            height: "50px"
          }}
        >
          {/* Centered content container */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "16px",
            justifyContent: "center"
          }}>
            {/* Install icon */}
            <div style={{
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
            
            {/* Message - Bold text */}
            <span style={{ 
              fontSize: "14px",
              fontWeight: "700", // Bold text
              letterSpacing: "0.25px"
            }}>
              Install Portfolio App for quick access!
            </span>

            {/* Install Button */}
            <button
              onClick={handleInstallClick}
              style={{
                backgroundColor: "white",
                color: "#c770f0", // Match portfolio purple
                border: "none",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f8f9fa";
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 4px 12px rgba(199, 112, 240, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "white";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
              }}
            >
              Install
            </button>

            {/* Close Button */}
            <button
              onClick={() => setShowInstallButton(false)}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.2s ease",
                width: "24px",
                height: "24px"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "rgba(255,255,255,0.15)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};