import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // atau pilih style lain

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [isBotStarted, setIsBotStarted] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const inputRef = useRef(null);

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
    setIsBotStarted(true);
    setIsBotTyping(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}`, {
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
      setIsBotTyping(false);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Unable to connect to the server." },
      ]);
      setIsBotTyping(false);
    }
  };

  const handleInputChange = (e) => {
    const newText = e.target.value;
    setInput(newText);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      {/* Logo placed on top with margin */}
      <div className="flex items-center justify-center p-3">
        <img src="/assets/icon.png" alt="Krowten AI" className="w-12 h-12" />
        <h1 className="text-gray-200 text-4xl font-bold ml-4">Krowten AI</h1>
      </div>

      <div
        className="w-full max-w-screen-sm md:max-w-3xl lg:max-w-4xl bg-gray-800 shadow-lg rounded-lg overflow-hidden mt-6"
        style={{ width: "70%", margin: "0 auto" }} // Centering and limiting width
      >
        {!isBotStarted && (
          <div className="text-center text-gray-400 text-sm">
            Ask me about network-related topics!
          </div>
        )}

        <div className="p-4 h-[calc(85vh-100px)] overflow-y-auto">
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
                  <ReactMarkdown
  className="markdown"
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeHighlight]}
>
  {msg.text}
</ReactMarkdown>

                  </div>
                  <img
                    src="https://www.w3schools.com/w3images/avatar2.png"
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                </div>
              ) : (
                <div className="flex space-x-2">
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

          {isBotTyping && (
            <div className="flex justify-start items-center space-x-2 mb-2">
              <img
                src="/assets/icon.png"
                alt="AI"
                className="w-8 h-8 rounded-full"
              />
              <div className="p-3 rounded-lg bg-gray-700 text-gray-200">
                <span className="animate-pulse">...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 flex mt-4">
          <textarea
            className="flex-1 p-2 border border-gray-600 rounded-l-lg focus:outline-none bg-gray-700 text-gray-200 resize-none"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className="bg-purple-400 text-gray-900 px-3 py-3 rounded-full hover:bg-purple-500"
            onClick={sendMessage}
          >
            <img
              src="/assets/papericon.png"
              alt="Send"
              className="w-5 h-5 rounded-full"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
