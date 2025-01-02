import { useState } from "react";
import { Link } from "react-router-dom"; 
import NavBarModal from './NavBarModal';
import { formatDistanceToNow } from 'date-fns';

interface Conversation {
  _id: string; 
  groupName: string; 
  messages: { sender: string; message: string; timestamp: string }[];
}

interface User {
  id?: string;
  email?: string;
}

interface NavbarProps {
  conversations: Conversation[];
  isOpen: boolean;
  session: User | null; 
  closeNav: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ conversations, isOpen, session, closeNav }) => {
  const [currentConvId, setCurrentConvId] = useState<string | null>(null);
  const [toggleSettings, setToggleSettings] = useState<boolean>(false);

  const handleConversationSelect = (id: string) => {
    setCurrentConvId(id);
    closeNav();
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "Invalid date";
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return "Invalid date";
    }
  };

  return (
    <nav
      className={`h-full fixed w-60 top-0 left-0 bg-zinc-700 z-10 transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:w-44`}
    >
      <div className="flex flex-col h-full text-white">
        <button
          onClick={closeNav}
          className="md:hidden self-end p-2 m-2 text-lg bg-zinc-700 hover:bg-zinc-600 rounded-full"
        >
          ✕
        </button>

        <div className="px-4 py-3 border-b border-zinc-700">
          <h2 className="text-lg font-semibold">Conversations</h2>
        </div>

        <div className="flex-grow overflow-y-auto">
          {conversations && conversations.length > 0 ? (
            conversations.map((conv) => (
              <Link 
                key={conv.id}
                to={`/conversation/${conv.id}`}
                onClick={() => handleConversationSelect(conv.id)}
                className={`px-4 py-3 cursor-pointer hover:bg-zinc-700 ${
                  currentConvId === conv.id ? "bg-zinc-700" : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <p className="truncate">{conv.groupName || "Untitled Conversation"}</p>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-sm text-zinc-400">
                      {conv.messages && conv.messages.length > 0
                        ? formatTimestamp(conv.messages[conv.messages.length - 1]?.timestamp || '')
                        : 'No messages'}
                    </p>
                    <button className="text-zinc-400">...</button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-zinc-400">No conversations yet</p>
          )}
        </div>

        {toggleSettings && <NavBarModal session={session?.email || null} />}
        
        {session?.email ? (
          <div
            onClick={() => setToggleSettings(!toggleSettings)}
            className="flex items-center px-4 py-3 bg-zinc-900 border-t border-zinc-700"
          >
            <img
              src="/user.png"
              alt="User Avatar"
              className="w-8 h-8 rounded-full mr-3"
            />
            <p className="truncate text-sm font-medium">{session?.email.split("@")[0]}</p>
          </div>
        ) : (
          <p className="px-4 py-3 text-sm text-zinc-400">No user data</p>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
