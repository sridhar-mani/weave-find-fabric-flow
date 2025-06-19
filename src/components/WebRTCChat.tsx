
import React, { useState, useEffect, useRef } from "react";
import Peer, { DataConnection } from "peerjs";

interface WebRTCChatProps {
  peerId: string;
  targetPeerId: string;
}

const WebRTCChat: React.FC<WebRTCChatProps> = ({ peerId, targetPeerId }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const connectionRef = useRef<DataConnection | null>(null);

  useEffect(() => {
    const peer = new Peer(peerId);

    peer.on("open", (id) => {
      console.log("My peer ID is: " + id);
      if (targetPeerId) {
        const conn = peer.connect(targetPeerId);
        connectionRef.current = conn;
        conn.on("data", (data: any) => {
          setMessages((prev) => [...prev, `Peer: ${data}`]);
        });
      }
    });

    peer.on("connection", (conn) => {
      connectionRef.current = conn;
      conn.on("data", (data: any) => {
        setMessages((prev) => [...prev, `Peer: ${data}`]);
      });
    });

    return () => {
      peer.destroy();
    };
  }, [peerId, targetPeerId]);

  const sendMessage = () => {
    if (connectionRef.current && input.trim()) {
      connectionRef.current.send(input);
      setMessages((prev) => [...prev, `Me: ${input}`]);
      setInput("");
    }
  };

  return (
    <div className="border p-2">
      <div className="h-40 overflow-y-auto mb-2">
        {messages.map((msg, idx) => (
          <div key={idx}>{msg}</div>
        ))}
      </div>
      <div className="flex">
        <input
          className="flex-1 border rounded px-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-2 py-1 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default WebRTCChat;
