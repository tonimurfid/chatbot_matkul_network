import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [isBotStarted, setIsBotStarted] = useState(false); // Track if the bot interaction has started

  useEffect(() => {
    const timer = setTimeout(() => setIsSplashVisible(false), 1500); // 1.5-second splash screen
    return () => clearTimeout(timer);
  }, []);

  const formatSource = (source) => {
    const regex = /([^:]+):\d+/;
    const match = source.match(regex);
    if (match) {
      const fileName = match[1].split("/").pop();
      const pageNumber = source.split(":")[1];
      return `${fileName.replace(/_/g, " ")} - Page ${pageNumber}`;
    }
    return source;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setIsBotStarted(true); // Mark bot interaction as started

    try {
      const response = await fetch("https://x8zg6rv3-8000.asse.devtunnels.ms/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query_text: input }),
      });

      const data = await response.json();
      const botMessage = {
        sender: "bot",
        text: data.response,
        sources: data.sources.map((source) => formatSource(source)),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Unable to connect to the server." },
      ]);
    }
  };

  if (isSplashVisible) {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-gray-900 transition-opacity duration-1000 ease-in-out"
        style={{ opacity: isSplashVisible ? 1 : 0 }}
      >
        <div className="text-center flex items-center space-x-4">
          <img src="/assets/icon.png" alt="Krowten AI" className="w-12 h-12" />
          <h1 className="text-gray-200 text-4xl font-bold">Krowten AI</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 transition-opacity duration-500 ease-in-out">
      <div className="w-full max-w-screen-lg bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 text-center text-2xl font-bold text-gray-200 flex items-center justify-center space-x-4">
          <img src="/assets/icon.png" alt="Krowten AI" className="w-8 h-8" />
          <span>Krowten AI</span>
        </div>

        {!isBotStarted && (
          <div className="text-center text-gray-400 text-sm">
            Ask me about network-related topics!
          </div>
        )}

        <div className="p-4 h-[calc(100vh-150px)] overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "user" ? (
                <div className="flex items-center space-x-2">
                  <div className="p-3 rounded-lg bg-purple-400 text-gray-900">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                  <img
                    src="https://www.w3schools.com/w3images/avatar2.png"
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <img
                    src="/assets/icon.png"
                    alt="AI"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="p-3 rounded-lg bg-gray-700 text-gray-200">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                    {msg.sources && (
                      <div className="text-xs text-gray-400 mt-2">
                        <strong>Sources:</strong>
                        <ul>
                          {msg.sources.map((source, idx) => (
                            <li key={idx}>{source}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 flex">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-600 rounded-l-lg focus:outline-none bg-gray-700 text-gray-200"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-purple-400 text-gray-900 px-4 rounded-r-lg hover:bg-purple-500"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
