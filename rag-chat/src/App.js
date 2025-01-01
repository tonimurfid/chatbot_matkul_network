import React, { useState } from "react";
import ReactMarkdown from "react-markdown"; // Import react-markdown

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const formatSource = (source) => {
    const regex = /([^:]+):(\d+)/;
    const match = source.match(regex);
    if (match) {
      const fileName = match[1].split("/").pop(); // Extract PDF name
      const pageNumber = match[2];
      return `${fileName.replace(/_/g, " ")} - Page ${pageNumber}`;
    }
    return source;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-screen-lg bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 text-center text-2xl font-bold text-blue-500">
          krowten.ai
        </div>

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
                  <img
                    src="https://www.w3schools.com/w3images/avatar2.png" // User icon
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                  <div
                    className="p-3 rounded-lg bg-blue-500 text-white"
                  >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                    {msg.sources && (
                      <div className="text-xs text-gray-500 mt-2">
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
              ) : (
                <div className="flex items-center space-x-2">
                  <img
                    src="assets/This Is Scary.jpeg" // AI logo
                    alt="AI"
                    className="w-8 h-8 rounded-full"
                  />
                  <div
                    className="p-3 rounded-lg bg-gray-200 text-gray-800"
                  >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                    {msg.sources && (
                      <div className="text-xs text-gray-500 mt-2">
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
            className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600"
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
