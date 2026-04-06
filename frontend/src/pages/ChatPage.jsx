import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatAPI, messageAPI } from '../services/api';
import Navbar from '../components/Navbar';

const Icon = ({ path, size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const icons = {
  send: <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
  plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  more: <><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></>,
  chevronLeft: <polyline points="15 18 9 12 15 6"/>,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
};

const ChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    const fetchChatDetails = async () => {
      if (chatId) {
        fetchMessages(chatId);
        
        // Try finding in local state first
        let chat = chats.find(c => c._id === chatId);
        
        // If not found (e.g. freshly created or page refresh), fetch it
        if (!chat && chats.length > 0 || !chat && !loading) {
          try {
            const res = await chatAPI.getChatById(chatId);
            chat = res.data;
            // Also append to the chat list if it wasn't there
            if (chat) {
              setChats(prev => {
                if (!prev.some(c => c._id === chat._id)) {
                  return [chat, ...prev];
                }
                return prev;
              });
            }
          } catch (err) {
            console.error("Error fetching chat details:", err);
          }
        }
        
        if (chat) setSelectedChat(chat);
      } else {
        setSelectedChat(null);
      }
    };
    
    fetchChatDetails();
  }, [chatId, chats, loading]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChats = async () => {
    try {
      const res = await chatAPI.fetchChats();
      setChats(res.data);
    } catch (err) {
      console.error("Error fetching chats:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (id) => {
    setFetchingMessages(true);
    try {
      const res = await messageAPI.getMessages(id);
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setFetchingMessages(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const { data } = await messageAPI.sendMessage({
        content: newMessage,
        chatId: selectedChat._id,
      });
      setMessages([...messages, data]);
      setNewMessage("");
      // Update last message in local chats list
      setChats(prev => prev.map(c => c._id === selectedChat._id ? { ...c, latestMessage: data } : c));
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const getChatName = (chat) => {
    if (!chat) return "";
    if (chat.isGroupChat) return chat.chatName;
    const otherUser = chat.users.find(u => u._id !== user?.id && u._id !== user?._id);
    return otherUser ? `${otherUser.username || otherUser.name}` : "User";
  };

  const filteredChats = chats.filter(c => 
    getChatName(c).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Navbar />
      
      <div className="flex-1 flex pt-20 overflow-hidden">
        {/* Sidebar */}
        <aside className={`w-full md:w-80 lg:w-96 bg-white border-r border-gray-100 flex flex-col transition-all overflow-hidden ${chatId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-gray-50">
            <h1 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Messages.</h1>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gray-900 transition-colors">
                <Icon path={icons.search} size={16} />
              </div>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-gray-900/5 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-400 space-y-4">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl animate-pulse mx-auto" />
                <p className="text-xs font-bold uppercase tracking-widest">Waking up servers...</p>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 mx-auto mb-4">
                  <Icon path={icons.user} size={24} />
                </div>
                <p className="text-sm font-bold text-gray-900">No conversations</p>
                <p className="text-xs text-gray-400 mt-1">Chat with a doctor to get started.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filteredChats.map((chat) => (
                  <button
                    key={chat._id}
                    onClick={() => navigate(`/chat/${chat._id}`)}
                    className={`w-full p-6 flex items-start gap-4 transition-all hover:bg-gray-50/50 relative ${selectedChat?._id === chat._id ? 'bg-white shadow-[inset_4px_0_0_0_#111827]' : ''}`}
                  >
                    <div className="w-14 h-14 bg-gray-900 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-black text-lg shadow-xl shadow-gray-200">
                      {getChatName(chat)[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-extrabold text-gray-900 truncate pr-2">{getChatName(chat)}</h3>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                          {chat.latestMessage ? new Date(chat.latestMessage.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-500 truncate">
                        {chat.latestMessage ? chat.latestMessage.content : "Start a new conversation"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className={`flex-1 flex flex-col bg-white overflow-hidden ${!chatId ? 'hidden md:flex' : 'flex'}`}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <header className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <button onClick={() => navigate('/chat')} className="md:hidden p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors">
                    <Icon path={icons.chevronLeft} size={24} />
                  </button>
                  <div className="w-12 h-12 bg-gray-900 rounded-2xl flex flex-shrink-0 items-center justify-center text-white font-black text-sm">
                    {getChatName(selectedChat)[0].toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-extrabold text-gray-900 text-lg leading-tight">{getChatName(selectedChat)}</h2>
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 bg-green-500 rounded-full" />
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Specialist</p>
                    </div>
                  </div>
                </div>
                <button className="w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-colors">
                  <Icon path={icons.more} size={20} />
                </button>
              </header>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/30">
                {fetchingMessages ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                  </div>
                ) : (
                  <>
                    {messages.map((m, i) => {
                      const isMe = m.sender._id === user?.id || m.sender._id === user?._id || m.sender === (user?.id || user?._id);
                      return (
                        <div key={m._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                          <div className={`max-w-[70%] ${isMe ? 'order-1' : 'order-2'}`}>
                            <div className={`p-5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${
                              isMe ? 'bg-gray-900 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                            }`}>
                              {m.content}
                            </div>
                            <p className={`text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-2 ${isMe ? 'text-right' : 'text-left'}`}>
                              {new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <footer className="p-8 bg-white border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-4">
                  <div className="flex-1 relative group">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="w-full pl-6 pr-14 py-5 bg-gray-50 border-none rounded-[2rem] text-sm font-medium focus:ring-4 focus:ring-gray-900/5 transition-all outline-none"
                    />
                    <button 
                      type="submit" 
                      disabled={!newMessage.trim()}
                      className="absolute right-3 top-2.5 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all disabled:opacity-20 disabled:grayscale"
                    >
                      <Icon path={icons.send} size={14} className="-ml-0.5 mt-0.5" />
                    </button>
                  </div>
                  <button type="button" className="hidden sm:flex w-14 h-14 bg-gray-50 text-gray-400 items-center justify-center rounded-[2rem] hover:text-gray-900 hover:bg-gray-100 transition-all">
                    <Icon path={icons.plus} size={20} />
                  </button>
                </form>
              </footer>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-gray-50/30">
              <div className="w-32 h-32 bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 flex items-center justify-center text-gray-200 mb-8 border border-gray-50">
                <Icon path={icons.chat} size={48} />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Your health HQ.</h2>
              <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">Select a specialist from the sidebar to continue your consultation or start a new chat from the doctors page.</p>
              <button 
                onClick={() => navigate('/doctors')}
                className="mt-10 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
              >
                Find Specialists
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
