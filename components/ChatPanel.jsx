"use client";
import React, { useState, useEffect, useRef } from "react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const ChatPanel = ({ pdfId }) => {
  const [replies, setReplies] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [replies]);

  const sendChat = async (e) => {
    e.preventDefault();

    setReplies((prevReplies) => [...prevReplies, input]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `${baseUrl}/api/learning-tools/pdf/${pdfId}/qna`,
        {
          method: "POST",
          body: JSON.stringify({ question: input }),
        }
      );

      if (!res.ok) throw new Error("Failed to send chat");

      const { results } = await res.json();

      setReplies((prevReplies) => [...prevReplies, results]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div
        ref={messagesEndRef}
        className="flex flex-col gap-4 flex-1 overflow-auto p-2"
      >
        {replies.map((reply, i) => (
          <div
            key={i}
            className={
              i % 2 === 0
                ? "self-end rounded-2xl px-3 py-1.5 bg-gray-600"
                : "self-start rounded-2xl px-3 py-1.5 bg-blue-600"
            }
          >
            {reply}
          </div>
        ))}
        <div>{loading ? "Thinking..." : ""}</div>
      </div>
      <form
        onSubmit={sendChat}
        autoComplete="off"
        className="mt-2 flex-shrink-0 flex p-2"
      >
        <input
          type="text"
          name="chat"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border-2 rounded-xl px-4 py-1"
        />
        <button
          type="submit"
          className="border-2 ml-1.5 px-2 py-1 rounded-2xl hover:text-black hover:bg-white"
          disabled={loading}
        >
          send
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
