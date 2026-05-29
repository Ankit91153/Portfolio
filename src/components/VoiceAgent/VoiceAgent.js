import React, { useState, useEffect, useRef, useCallback } from "react";
import Vapi from "@vapi-ai/web";
import chatbotGif from "../../Assets/chatbot.gif";
import "./VoiceAgent.css";

const VAPI_PUBLIC_KEY = process.env.REACT_APP_VAPI_PUBLIC_KEY;
const VAPI_ASSISTANT_ID = process.env.REACT_APP_VAPI_ASSISTANT_ID;
const FIRST_MESSAGE=process.env.REACT_APP_VAPI_FIRST_MESSAGE


function VoiceAgent() {
  const vapiRef = useRef(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [callStatus, setCallStatus] = useState("idle");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [transcript, setTranscript] = useState([
    { role: "assistant", text: FIRST_MESSAGE, id: 0 },
  ]);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const transcriptEndRef = useRef(null);
  const [hasBadKey, setHasBadKey] = useState(false);

  useEffect(() => {
    if (!VAPI_PUBLIC_KEY || !VAPI_ASSISTANT_ID) {
      setHasBadKey(true);
    }
  }, []);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExpanded(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hasBadKey) return;

    const vapi = new Vapi(VAPI_PUBLIC_KEY);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      setCallStatus("active");
    });

    vapi.on("call-end", () => {
      setCallStatus("idle");
      setIsSpeaking(false);
      setIsUserSpeaking(false);
      setVolumeLevel(0);
      setTranscript([{ role: "assistant", text: FIRST_MESSAGE, id: 0 }]);
    });

    vapi.on("speech-start", () => {
      setIsSpeaking(true);
    });

    vapi.on("speech-end", () => {
      setIsSpeaking(false);
    });

    vapi.on("volume-level", (vol) => {
      setVolumeLevel(vol);
    });

    vapi.on("message", (msg) => {
      if (msg.type === "transcript") {
        const role = msg.role;
        const text = msg.transcript;
        const isFinal = msg.transcriptType === "final";

        setTranscript((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.role === role && !last.isFinal) {
            return [...prev.slice(0, -1), { ...last, text, isFinal }];
          }
          return [...prev, { role, text, isFinal, id: Date.now() }];
        });

        if (role === "user") {
          setIsUserSpeaking(!isFinal);
        }
      }
    });

    vapi.on("error", (err) => {
      console.error("VAPI error:", err);
      setCallStatus("idle");
    });

    return () => {
      vapi.stop();
    };
  }, [hasBadKey]);

  const startCall = useCallback(async () => {
    if (hasBadKey) return;
    if (callStatus === "active" || callStatus === "connecting") return;

    setCallStatus("connecting");
    setTranscript([{ role: "assistant", text: "Connecting…", id: 0 }]);

    try {
      await vapiRef.current.start(VAPI_ASSISTANT_ID);
    } catch (err) {
      console.error("Failed to start VAPI call:", err);
      setCallStatus("idle");
      setTranscript([{ role: "assistant", text: FIRST_MESSAGE, id: 0 }]);
    }
  }, [hasBadKey, callStatus]);

  const endCall = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
    setCallStatus("idle");
    setIsSpeaking(false);
    setIsUserSpeaking(false);
    setTranscript([{ role: "assistant", text: FIRST_MESSAGE, id: 0 }]);
  }, []);

  const avatarClass = [
    "va-avatar",
    callStatus === "active" && isSpeaking ? "va-avatar--speaking" : "",
    callStatus === "active" && isUserSpeaking ? "va-avatar--listening" : "",
    callStatus === "connecting" ? "va-avatar--connecting" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const isCallActive = callStatus === "active" || callStatus === "connecting";

  return (
    <div className={`va-wrapper ${isExpanded ? "va-wrapper--expanded" : "va-wrapper--collapsed"}`}>
      {!isExpanded && (
        <button
          className="va-pill"
          onClick={() => setIsExpanded(true)}
          aria-label="Open AI voice assistant"
        >
          <span className="va-pill__pulse" />
          <img src={chatbotGif} alt="AI" className="va-pill__bot-img" />
          <span className="va-pill__label">Talk to me</span>
        </button>
      )}

      {isExpanded && (
        <div className="va-card">
          <div className="va-card__header">
            <div className="va-card__header-left">
              <div className={avatarClass}>
                <img src={chatbotGif} alt="AI Assistant" className="va-avatar__img" />
                <div className="va-soundwave">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="va-soundwave__bar"
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        height:
                          callStatus === "active" && isSpeaking
                            ? `${Math.max(4, Math.min(24, 8 + volumeLevel * 200 * (0.5 + Math.random() * 0.5)))}px`
                            : "6px",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="va-card__title-block">
                <span className="va-card__title">Ankit's AI Voice Agent</span>
                <span className={`va-card__status va-card__status--${callStatus}`}>
                  {callStatus === "idle" && "Ready to chat"}
                  {callStatus === "connecting" && "Connecting…"}
                  {callStatus === "active" && isSpeaking && "Speaking…"}
                  {callStatus === "active" && isUserSpeaking && "Listening…"}
                  {callStatus === "active" && !isSpeaking && !isUserSpeaking && "Active"}
                </span>
              </div>
            </div>
            <button
              className="va-card__close"
              onClick={() => setIsExpanded(false)}
              aria-label="Minimize voice agent"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="va-transcript">
            {hasBadKey && (
              <div className="va-key-warning">
                <span>⚠️</span>
                <div>
                  <strong>VAPI credentials not set.</strong>
                  <br />
                  Add <code>REACT_APP_VAPI_PUBLIC_KEY</code> and{" "}
                  <code>REACT_APP_VAPI_ASSISTANT_ID</code> to your{" "}
                  <code>.env</code> file.
                </div>
              </div>
            )}

            {transcript.map((msg, idx) => (
              <div
                key={msg.id ?? idx}
                className={`va-msg va-msg--${msg.role} ${!msg.isFinal && msg.role !== "assistant" ? "va-msg--interim" : ""}`}
              >
                {msg.role === "assistant" && (
                  <img src={chatbotGif} alt="Bot" className="va-msg__avatar-img" />
                )}
                <div className="va-msg__bubble">
                  <p className="va-msg__text">{msg.text}</p>
                </div>
                {msg.role === "user" && (
                  <div className="va-msg__avatar-user">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" fill="currentColor"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}

            {callStatus === "connecting" && (
              <div className="va-msg va-msg--assistant">
                <img src={chatbotGif} alt="Bot" className="va-msg__avatar-img" />
                <div className="va-msg__bubble">
                  <div className="va-typing">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}

            <div ref={transcriptEndRef} />
          </div>

          <div className="va-controls">
            {!isCallActive && (
              <button
                className="va-btn va-btn--primary"
                onClick={startCall}
                disabled={hasBadKey}
                id="va-start-btn"
              >
                <svg className="va-btn__icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" fill="currentColor"/>
                </svg>
                Start Conversation
              </button>
            )}

            {isCallActive && (
              <button
                className="va-btn va-btn--danger"
                onClick={endCall}
                id="va-end-btn"
              >
                <svg className="va-btn__icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" fill="currentColor"/>
                </svg>
                End Conversation
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VoiceAgent;
