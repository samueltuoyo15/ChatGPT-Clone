import { useState } from "react";

interface Conversation {
  _id: string; // Matches MongoDB's ObjectId
  groupName: string; // Title of the conversation
  messages: { sender: string; content: string }[]; // Array of messages
}

interface User {
  id: string;
  email: string;
}

interface NavbarProps {
  conversations: Conversation[];
  isOpen: boolean;
  session: User | null; // Single user instead of an array
  closeNav: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ conversations, isOpen, session, closeNav }) => {
  const [currentConvId, setCurrentConvId] = useState<string | null>(null);

  const handleConversationSelect = (id: string) => {
    setCurrentConvId(id);
    closeNav();
  };

  return (
    <nav
      className={`h-full font-sans fixed w-52 top-0 left-0 bg-zinc-800 z-10 shadow-lg transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:w-60`}
    >
      <div className="w-full h-full flex flex-col text-white">
        {/* Close button for mobile */}
        <button
          onClick={closeNav}
          className="md:hidden self-end p-2 text-lg text-white bg-zinc-700 hover:bg-zinc-600 rounded-full m-2"
        >
          ✕
        </button>

        {/* Navbar Header */}
        <div className="px-4 py-3 border-b border-zinc-700">
          <h2 className="text-lg font-semibold">Conversations</h2>
        </div>

        {/* Conversations List */}
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
        <p className="truncate">
          {conv.groupName || ""}
        </p>
      </div>
    ))
  ) : (
    <p className="px-4 py-3 text-sm text-zinc-400">No conversations yet</p>
  )}
</div>

        {/* User Section */}
        {session && session.length > 0? (
          <div className="flex items-center px-4 py-3 bg-zinc-900 border-t border-zinc-700">
            <img
              src="/user.png"
              alt="User Avatar"
              className="w-8 h-8 rounded-full mr-3"
            />
            <p className="text-sm font-medium truncate">{session[0]?.email.split("@")[0]}</p>
          </div>
        ) : (
          <p className="px-4 py-3 text-sm text-zinc-400">No user data</p>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
