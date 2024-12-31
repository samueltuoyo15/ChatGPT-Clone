import { useState } from "react";
import NavBarModal from './NavBarModal';

interface Conversation {
  _id: string; 
  groupName: string; 
  messages: { sender: string; content: string }[];
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

  return (
    <nav
      onClick={(e) => { if (e.target === e.currentTarget) closeNav(); }}
      className={`fixed top-0 left-0 w-64 h-full bg-zinc-800 z-10 shadow-lg transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:w-60`}
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
          {conversations.length > 0 ? (
            conversations.map((conv) => (
              <div
                key={conv._id}
                onClick={() => handleConversationSelect(conv._id)}
                className={`px-4 py-3 cursor-pointer hover:bg-zinc-700 ${
                  currentConvId === conv._id ? "bg-zinc-700" : ""
                }`}
              >
                <p className="truncate">{conv?.groupName || "Untitled Conversation"}</p>
              </div>
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
