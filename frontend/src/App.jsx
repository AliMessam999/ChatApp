import { useEffect, useRef, useState } from 'react';
import { connectWS } from './ws';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { IoIosSend } from "react-icons/io";

export default function App() {
  const timer = useRef(null);
  const socket = useRef(null);

  const [userName, setUserName] = useState('');
  const [showNamePopup, setShowNamePopup] = useState(true);
  const [inputName, setInputName] = useState('');

  const [showRoomPopup, setShowRoomPopup] = useState(false);
  const [roomName, setRoomName] = useState('');

  // Separate states for create/join
  const [createRoomInput, setCreateRoomInput] = useState('');
  const [joinRoomInput, setJoinRoomInput] = useState('');

  const [typers, setTypers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    socket.current = connectWS();

    socket.current.on("connect", () => {
      socket.current.on('roomNotice', (userName) => {
        toast.info(`${userName} joined the room`);
      });

      socket.current.on('chatMessage', (msg) => {
        setMessages(prev => [...prev, msg]);
      });

      socket.current.on('typing', (userName) => {
        setTypers(prev => {
          if(prev.includes(userName)) return prev;
          return [...prev, userName];
        });
      });

      socket.current.on('stopTyping', (userName) => {
        setTypers(prev => prev.filter(t => t !== userName));
      });
    });

    return () => {
      socket.current.off('connect');
      socket.current.off('roomNotice');
      socket.current.off('chatMessage');
      socket.current.off('typing');
      socket.current.off('stopTyping');
    }
  }, []);

  useEffect(() => {
    if(text.length > 0){
      socket.current.emit('typing', { roomName, userName });
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      socket.current.emit('stopTyping', { roomName, userName });
    }, 1000);

    return () => clearTimeout(timer.current);
  }, [text, userName, roomName]);

  function formatTime(ts) {
    const d = new Date(ts);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  function handleNameSubmit(e) {
    e.preventDefault();
    const trimmed = inputName.trim();
    if(!trimmed) return;

    setUserName(trimmed);
    setShowNamePopup(false);
    setShowRoomPopup(true);
  }

  function handleCreateRoomSubmit(e) {
    e.preventDefault();
    const trimmed = createRoomInput.trim();
    if(!trimmed) return;

    setRoomName(trimmed);
    setShowRoomPopup(false);

    socket.current.emit('joinRoom', { roomName: trimmed, userName });
    toast.success(`Room (${trimmed}) created`);
  }

  function handleJoinRoomSubmit(e) {
    e.preventDefault();
    const trimmed = joinRoomInput.trim();
    if(!trimmed) return;

    setRoomName(trimmed);
    setShowRoomPopup(false);

    socket.current.emit('joinRoom', { roomName: trimmed, userName });
    toast.success(`Room (${trimmed}) joined`);
  }

  function sendMessage() {
    const t = text.trim();
    if(!t) return;

    const msg = { id: Date.now(), sender: userName, text: t, ts: Date.now() };
    setMessages(prev => [...prev, msg]);
    socket.current.emit('chatMessage', { roomName, msg });
    setText('');
  }

  function handleKeyDown(e) {
    if(e.key === 'Enter' && !e.shiftKey){
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-4 font-inter">

      {/* NAME POPUP */}
      {showNamePopup && (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h1 className="text-xl font-semibold text-black">Enter your name</h1>
            <p className="text-sm text-gray-500 mt-1">Enter your name to start chatting.</p>
            <form onSubmit={handleNameSubmit} className="mt-4">
              <input
                autoFocus
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 outline-green-500 placeholder-gray-400"
                placeholder="Your name (e.g. John Doe)"
              />
              <button type="submit" className="block ml-auto mt-3 px-4 py-1.5 rounded-full bg-green-500 text-white font-medium cursor-pointer">
                Continue
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ROOM POPUP */}
      {showRoomPopup && (
        <div className="flex gap-6 w-200">
          
          {/* CREATE ROOM */}
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h1 className="text-xl font-semibold text-black">Create Room</h1>
            <p className="text-sm text-gray-500 mt-1">Enter a room name to create a room.</p>
            <form onSubmit={handleCreateRoomSubmit} className="mt-4">
              <input
                autoFocus
                value={createRoomInput}
                onChange={(e) => setCreateRoomInput(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 outline-green-500 placeholder-gray-400"
                placeholder="Room name"
              />
              <button type="submit" className="block ml-auto mt-3 px-4 py-1.5 rounded-full bg-green-500 text-white font-medium cursor-pointer">
                Create Room
              </button>
            </form>
          </div>

          {/* JOIN ROOM */}
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h1 className="text-xl font-semibold text-black">Join Room</h1>
            <p className="text-sm text-gray-500 mt-1">Enter a room name to join a room.</p>
            <form onSubmit={handleJoinRoomSubmit} className="mt-4">
              <input
                value={joinRoomInput}
                onChange={(e) => setJoinRoomInput(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 outline-green-500 placeholder-gray-400"
                placeholder="Room name"
              />
              <button type="submit" className="block ml-auto mt-3 px-4 py-1.5 rounded-full bg-green-500 text-white font-medium cursor-pointer">
                Join Room
              </button>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />

      {/* CHAT WINDOW */}
      {!showNamePopup && !showRoomPopup && (
        <div className="w-full max-w-2xl h-[90vh] bg-white rounded-xl shadow-md flex flex-col overflow-hidden">
          
          {/* CHAT HEADER */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
            <div className="h-15 w-15 rounded-full bg-black flex items-center justify-center text-white font-semibold">
              {roomName}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-[#303030]">Realtime chat</div>
              {typers.length ? (
                <div className="text-xs text-gray-500">{typers.join(', ')} is typing...</div>
              ) : null}
            </div>
            <div className="text-sm text-gray-500">
              Signed in as <span className="font-medium text-[#303030] capitalize">{userName}</span>
            </div>
          </div>

          {/* CHAT MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-100 flex flex-col">
            {messages.map(m => {
              const mine = m.sender === userName;
              return (
                <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[78%] p-3 my-2 rounded-[18px] text-sm leading-5 shadow-lg ${
                    mine ? 'bg-[#DCF8C6] text-[#303030] rounded-br-2xl' : 'bg-white text-[#303030] rounded-bl-2xl'
                  }`}>
                    <div>{m.text}</div>
                    <div className="flex justify-between items-center mt-1 gap-16">
                      <div className="text-[11px] font-bold">{mine ? null : m.sender}</div>
                      <div className="text-[11px] text-gray-500 text-right">{formatTime(m.ts)}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* CHAT INPUT */}
          <div className="px-4 py-3 border-t border-gray-200 bg-white">
            <div className="flex items-center justify-between gap-4 border border-gray-200 rounded-full">
              <textarea
                rows={1}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="w-full resize-none px-4 py-4 text-sm outline-none"
              />
              <button onClick={sendMessage} className="bg-black text-white px-2 py-2 mr-2 text-center rounded-full text-sm font-medium cursor-pointer">
                <IoIosSend size={25} />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}