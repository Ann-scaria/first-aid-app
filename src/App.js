import React, { useState, useRef } from "react";
import HospitalMap from "./components/HospitalMap"; // ✅ Import the map

// Translation object
const translations = {
  en: {
    heart: "Heart Attack",
    snake: "Snake Bite",
    accident: "Road Accident",
    callHospital: "Call Hospital",
    instructions: {
      heart: [
        "Call emergency services immediately.",
        "Keep the person calm and seated.",
        "Give aspirin if available and not allergic."
      ],
      snake: [
        "Keep the victim calm and still.",
        "Keep the bitten limb below heart level.",
        "Go to the nearest hospital immediately."
      ],
      accident: [
        "Ensure the scene is safe.",
        "Call emergency services.",
        "Do not move the injured unless necessary."
      ]
    },
    chatbot: {
      unknown: "I'm sorry, I can help with heart attack, snake bite, or road accident first aid. Please ask about one of these."
    }
  },
  hi: {
    heart: "दिल का दौरा",
    snake: "साँप का काटना",
    accident: "सड़क दुर्घटना",
    callHospital: "अस्पताल कॉल करें",
    instructions: {
      heart: [
        "तुरंत आपातकालीन सेवाओं को बुलाएं।",
        "व्यक्ति को शांत और बैठा रखें।",
        "यदि एलर्जी न हो तो एस्पिरिन दें।"
      ],
      snake: [
        "पीड़ित को शांत और स्थिर रखें।",
        "काटे गए अंग को हृदय के स्तर से नीचे रखें।",
        "तुरंत अस्पताल जाएं।"
      ],
      accident: [
        "सुनिश्चित करें कि स्थान सुरक्षित है।",
        "आपातकालीन सेवाओं को बुलाएं।",
        "जब तक आवश्यक न हो घायल को न हिलाएं।"
      ]
    },
    chatbot: {
      unknown: "माफ़ कीजिए, मैं दिल का दौरा, साँप के काटने, या सड़क दुर्घटना में मदद कर सकता हूँ। कृपया इनमें से किसी के बारे में पूछें।"
    }
  },
  ta: {
    heart: "இதய நோய்",
    snake: "பாம்பு கடிதல்",
    accident: "சாலை விபத்து",
    callHospital: "அஸ்பத்திரிக்கு அழைப்பு",
    instructions: {
      heart: [
        "அவசர சேவைகளை உடனடியாக அழைக்கவும்.",
        "நபரை அமைதியாக உட்கார வைக்கவும்.",
        "மலச்சிக்கையில்லையெனில் ஆச்பிரின் கொடுக்கவும்."
      ],
      snake: [
        "பீடிக்கப்பட்ட நபரை அமைதியாக வைக்கவும்.",
        "காயமடைந்த உறுப்பை இதயத்துக்குள் கீழே வைக்கவும்.",
        "அடுத்த மருத்துவமனைக்கு உடனடியாக செல்லவும்."
      ],
      accident: [
        "இடம் பாதுகாப்பாக உள்ளது என உறுதிப்படுத்தவும்.",
        "அவசர சேவைகளை அழைக்கவும்.",
        "தேவையில்லாத வரை காயமடைந்தவரை நகர்த்த வேண்டாம்."
      ]
    },
    chatbot: {
      unknown: "மன்னிக்கவும், நான் இதய நோய், பாம்பு கடிதல் அல்லது சாலை விபத்து மீதான உதவியை மட்டுமே வழங்கலாம். தயவுசெய்து கேளுங்கள்."
    }
  },
  ml: {
    heart: "ഹൃദയാഘാതം",
    snake: "പാമ്പ് കടിയേറ്റത്",
    accident: "റോഡ് അപകടം",
    callHospital: "ആശുപത്രിയിലേക്ക് വിളിക്കുക",
    instructions: {
      heart: [
        "തെരുവ് അടിയന്തര സേവനങ്ങളെ ഉടൻ വിളിക്കുക.",
        "വ്യക്തിയെ ശാന്തമായി ഇരുത്തുക.",
        "അലർജി ഇല്ലെങ്കിൽ ആസ്പിറിൻ കൊടുക്കുക."
      ],
      snake: [
        "ബാധിതനെ ശാന്തമായി നിലനിർത്തുക.",
        "കടിയേറ്റ അംശം ഹൃദയ താളത്തിന്റെ താഴെ സൂക്ഷിക്കുക.",
        "ഏറ്റവും അടുത്ത ആശുപത്രിയിലേക്ക് ഉടൻ പോകുക."
      ],
      accident: [
        "സ്ഥലം സുരക്ഷിതമാണെന്ന് ഉറപ്പാക്കുക.",
        "അടിയന്തര സേവനങ്ങളെ വിളിക്കുക.",
        "അവശ്യമായില്ലെങ്കിൽ പരിക്കേറ്റവനെ നീക്കരുത്."
      ]
    },
    chatbot: {
      unknown: "ക്ഷമിക്കണം, ഞാൻ ഹൃദയാഘാതം, പാമ്പ് കടിയേറ്റത്, അല്ലെങ്കിൽ റോഡ് അപകടം സംബന്ധിച്ച സഹായം മാത്രമേ നൽകൂ."
    }
  }
};

export default function App() {
  const [lang, setLang] = useState("en");
  const [instructions, setInstructions] = useState("");
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const chatWindowRef = useRef(null);

  // Helper function for speech
  const speakText = (text) => {
    const utterance = new window.SpeechSynthesisUtterance(text);
    if (lang === "hi") utterance.lang = "hi-IN";
    else if (lang === "ta") utterance.lang = "ta-IN";
    else if (lang === "ml") utterance.lang = "ml-IN";
    else utterance.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // Show instructions with voice
  const showInstructions = (type) => {
    const steps = translations[lang].instructions[type];
    setInstructions(
      <ol>
        {steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    );
    speakText(steps.join(" "));
  };

  // Chatbot response
  const getFirstAidResponse = (msg) => {
    const lower = msg.toLowerCase();
    if (lower.includes("heart") || lower.includes("दिल") || lower.includes("இதய") || lower.includes("ഹൃദയ")) {
      return translations[lang].instructions.heart.join(" ");
    } else if (lower.includes("snake") || lower.includes("साँप") || lower.includes("பாம்பு") || lower.includes("പാമ്പ്")) {
      return translations[lang].instructions.snake.join(" ");
    } else if (lower.includes("accident") || lower.includes("सड़क") || lower.includes("விபத்து") || lower.includes("അപകടം")) {
      return translations[lang].instructions.accident.join(" ");
    } else {
      return translations[lang].chatbot.unknown;
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    const botResponse = getFirstAidResponse(userMsg);
    setChat([...chat, { sender: "You", text: userMsg }, { sender: "Bot", text: botResponse }]);
    speakText(botResponse);
    setInput("");
    setTimeout(() => {
      if (chatWindowRef.current) chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }, 100);
  };

  const handleVoice = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang === "hi" ? "hi-IN" : lang === "ta" ? "ta-IN" : lang === "ml" ? "ml-IN" : "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setTimeout(handleSend, 100);
    };
    recognition.start();
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", padding: "20px" }}>
      <header style={{ marginBottom: "20px" }}>
        <h1>Emergency First-Aid Website</h1>
        <p>Select language and click an emergency to see instructions</p>
        <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ padding: "8px", fontSize: "16px" }}>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="ta">Tamil</option>
          <option value="ml">Malayalam</option>
        </select>
      </header>

      <div>
        <button onClick={() => showInstructions("heart")} style={{ margin: "10px", padding: "12px 20px", fontSize: "16px" }}>{translations[lang].heart}</button>
        <button onClick={() => showInstructions("snake")} style={{ margin: "10px", padding: "12px 20px", fontSize: "16px" }}>{translations[lang].snake}</button>
        <button onClick={() => showInstructions("accident")} style={{ margin: "10px", padding: "12px 20px", fontSize: "16px" }}>{translations[lang].accident}</button>
        <a href="tel:108" style={{ display: "inline-block", marginLeft: "12px", padding: "10px 18px", background: "#d32f2f", color: "#fff", borderRadius: "6px", textDecoration: "none", fontSize: "16px", verticalAlign: "middle" }}>
          📞 {translations[lang].callHospital}
        </a>
      </div>

      <div style={{ marginTop: "20px", fontSize: "18px", color: "#333" }}>
        {instructions}
      </div>

      {/* Chatbot */}
      <div style={{ maxWidth: "400px", margin: "32px auto", padding: "16px", border: "1px solid #ccc", borderRadius: "8px", boxShadow: "0 2px 8px #eee", background: "#fafafa" }}>
        <h2 style={{ textAlign: "center" }}>First Aid Chatbot</h2>
        <div ref={chatWindowRef} style={{ height: "200px", overflowY: "auto", background: "#fff", border: "1px solid #ddd", padding: "8px", marginBottom: "8px", borderRadius: "4px" }}>
          {chat.map((c, i) => (
            <div key={i} style={{ margin: "6px 0" }}><strong>{c.sender}:</strong> {c.text}</div>
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
          <button onClick={handleSend} style={{ padding: "8px 12px" }}>Send</button>
          <button onClick={handleVoice} style={{ fontSize: "18px" }} title="Speak">🎤</button>
        </div>
      </div>

      {/* ✅ Add Hospital Map */}
      <div style={{ marginTop: "40px" }}>
        <h2>Nearby Hospitals</h2>
        <HospitalMap />
      </div>
    </div>
  );
}
 