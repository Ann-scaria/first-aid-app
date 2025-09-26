import React, { useState, useRef } from "react";

// 🔊 Speak text aloud (supports Hindi + English)
function speakText(text) {
  const utterance = new window.SpeechSynthesisUtterance(text);
  if (text.match(/[\u0900-\u097F]/)) {
    utterance.lang = "hi-IN";
  } else {
    utterance.lang = "en-US";
  }
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export default function FirstAidApp() {
  const [instructions, setInstructions] = useState("");
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const chatWindowRef = useRef(null);

  // 📌 Show first-aid instructions
  const showInstructions = (type) => {
    let html = "";
    let textToRead = "";

    if (type === "heart") {
      html = `
        <h2>Heart Attack First-Aid Steps</h2>
        <ol>
          <li>Call emergency services immediately.</li>
          <li>Keep the person calm and seated.</li>
          <li>Give aspirin if available and not allergic.</li>
        </ol>`;
      textToRead =
        "Heart Attack First-Aid Steps. Call emergency services immediately. Keep the person calm and seated. Give aspirin if available and not allergic.";
    } else if (type === "snake") {
      html = `
        <h2>Snake Bite First-Aid Steps</h2>
        <ol>
          <li>Keep the victim calm and still.</li>
          <li>Keep the bitten limb below heart level.</li>
          <li>Go to the nearest hospital immediately.</li>
        </ol>`;
      textToRead =
        "Snake Bite First-Aid Steps. Keep the victim calm and still. Keep the bitten limb below heart level. Go to the nearest hospital immediately.";
    } else if (type === "accident") {
      html = `
        <h2>Road Accident First-Aid Steps</h2>
        <ol>
          <li>Ensure the scene is safe.</li>
          <li>Call emergency services.</li>
          <li>Do not move the injured unless necessary.</li>
        </ol>`;
      textToRead =
        "Road Accident First-Aid Steps. Ensure the scene is safe. Call emergency services. Do not move the injured unless necessary.";
    }

    setInstructions(html);
    speakText(textToRead);
  };

  // 📌 Get chatbot response
  const getFirstAidResponse = (msg) => {
    const lower = msg.toLowerCase();

    if (lower.includes("दिल") || lower.includes("heart")) {
      if (msg.includes("दिल")) {
        return "दिल का दौरा पड़ने पर तुरंत आपातकालीन सेवाओं को बुलाएं। व्यक्ति को शांत और बैठा रखें। यदि एलर्जी न हो तो एस्पिरिन दें।";
      }
      return "Heart Attack First-Aid Steps: Call emergency services immediately. Keep the person calm and seated. Give aspirin if available and not allergic.";
    } else if (lower.includes("साँप") || lower.includes("snake")) {
      if (msg.includes("साँप")) {
        return "साँप के काटने पर पीड़ित को शांत और स्थिर रखें। काटे गए अंग को हृदय के स्तर से नीचे रखें। तुरंत अस्पताल जाएं।";
      }
      return "Snake Bite First-Aid Steps: Keep the victim calm and still. Keep the bitten limb below heart level. Go to the nearest hospital immediately.";
    } else if (
      lower.includes("सड़क") ||
      lower.includes("accident") ||
      lower.includes("road")
    ) {
      if (msg.includes("सड़क")) {
        return "सड़क दुर्घटना के बाद सुनिश्चित करें कि स्थान सुरक्षित है। आपातकालीन सेवाओं को बुलाएं। जब तक आवश्यक न हो घायल को न हिलाएं।";
      }
      return "Road Accident First-Aid Steps: Ensure the scene is safe. Call emergency services. Do not move the injured unless necessary.";
    } else {
      if (msg.match(/[\u0900-\u097F]/)) {
        return "माफ़ कीजिए, मैं दिल का दौरा, साँप के काटने, या सड़क दुर्घटना में मदद कर सकता हूँ। कृपया इनमें से किसी के बारे में पूछें।";
      }
      return "I'm sorry, I can help with heart attack, snake bite, or road accident first aid. Please ask about one of these.";
    }
  };

  // 📌 Handle chatbot send
  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    const botResponse = getFirstAidResponse(userMsg);

    setChat((prev) => [...prev, { sender: "You", text: userMsg }, { sender: "Bot", text: botResponse }]);
    speakText(botResponse);
    setInput("");

    setTimeout(() => {
      if (chatWindowRef.current) {
        chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
      }
    }, 100);
  };

  // 🎤 Voice recognition
  const handleVoice = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = input.match(/[\u0900-\u097F]/) ? "hi-IN" : "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setTimeout(handleSend, 100);
    };

    recognition.start();
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", padding: "20px" }}>
      {/* Header */}
      <header style={{ marginBottom: "30px" }}>
        <h1>Emergency First-Aid Website</h1>
        <p>Click any emergency to see instructions</p>
      </header>

      {/* Buttons */}
      <div>
        <button onClick={() => showInstructions("heart")}>❤ Heart Attack</button>
        <button onClick={() => showInstructions("snake")}>🐍 Snake Bite</button>
        <button onClick={() => showInstructions("accident")}>🚑 Road Accident</button>
        <a
          href="tel:108"
          style={{
            display: "inline-block",
            marginLeft: "12px",
            padding: "10px 18px",
            background: "#d32f2f",
            color: "#fff",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "16px",
          }}
        >
          📞 Call Hospital
        </a>
      </div>

      {/* Instructions */}
      <div
        style={{ marginTop: "30px", fontSize: "20px", color: "#333" }}
        dangerouslySetInnerHTML={{ __html: instructions }}
      />

      {/* Chatbot */}
      <div
        style={{
          maxWidth: "400px",
          margin: "32px auto",
          padding: "16px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 2px 8px #eee",
          background: "#fafafa",
        }}
      >
        <h2 style={{ textAlign: "center" }}>First Aid Chatbot</h2>
        <div
          ref={chatWindowRef}
          style={{
            height: "200px",
            overflowY: "auto",
            background: "#fff",
            border: "1px solid #ddd",
            padding: "8px",
            marginBottom: "8px",
            borderRadius: "4px",
            textAlign: "left",
          }}
        >
          {chat.map((m, i) => (
            <div key={i} style={{ margin: "8px 0" }}>
              <strong>{m.sender}:</strong> {m.text}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your first aid question..."
            style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend}>Send</button>
          <button onClick={handleVoice} title="Speak" style={{ fontSize: "18px" }}>
            🎤
          </button>
        </div>
      </div>
    </div>
  );
}
